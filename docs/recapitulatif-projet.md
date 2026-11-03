# Lyshannti – Récapitulatif du projet

> État au 4 novembre 2026. Document de relecture : ce qui existe, comment c'est organisé, ce qui reste à faire.

## En bref
- **Site public** (7 pages + blog complet) et **back-office `/admin`** : tous construits et fonctionnels en local.
- **Base PostgreSQL** : 11 tables, gérées par Prisma (2 migrations), remplies par un script de démo.
- **Connexion admin sécurisée** (NextAuth v4), écriture en base via des actions serveur protégées.
- **Pas encore en ligne avec le backend** : la démo GitHub Pages est figée (statique, sans base). Il reste à choisir l'hébergeur.

---

## 1. Stack technique

| Rôle | Outil |
|---|---|
| Framework | Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript |
| Style | Tailwind CSS 4, shadcn/ui (Base UI) – peu utilisé côté public pour garder un JS léger |
| Base de données | PostgreSQL 18 (Postgres.app en local) + Prisma 7 (adaptateur `pg`) |
| Connexion admin | NextAuth v4 (identifiants + JWT), bcryptjs |
| Éditeur d'articles | Tiptap 3 (contenu enregistré en JSON) |
| Validation | Zod 4 (navigateur ET serveur) + React Hook Form |
| E-mails | Resend (sans clé : e-mail affiché dans le terminal) |
| Images | sharp (vérification, conversion WebP, retrait EXIF/GPS) |

---

## 2. Base de données PostgreSQL

### Vue d'ensemble des relations
```
users ──< articles >── categories
  │          │  └──< article_tags >── tags
  │          ├── cover   ──> media
  │          └── ogImage ──> media
  ├──< media (uploadedBy)
  └──< password_reset_tokens

login_attempts   contacts   settings (1 ligne)      ← tables indépendantes
```
`──<` = « un pour plusieurs ».

### Les tables

#### `users` – comptes admin
| Champ | Type | Rôle |
|---|---|---|
| id | cuid | identifiant |
| email | texte, **unique** | identifiant de connexion |
| name | texte | nom affiché |
| passwordHash | texte | mot de passe **haché bcrypt (coût 12)**, jamais en clair |
| role | `ADMIN` | un seul rôle pour l'instant |
| sessionVersion | entier | incrémenté = toutes les sessions fermées |
| lastLoginAt, createdAt, updatedAt | dates | suivi |

#### `password_reset_tokens` – liens « mot de passe oublié »
| Champ | Rôle |
|---|---|
| tokenHash (**unique**) | empreinte SHA-256 du jeton (le jeton lui-même n'est jamais stocké) |
| expiresAt | 30 minutes |
| usedAt | usage unique |
| userId | → `users` (supprimé avec le compte) |

#### `login_attempts` – anti-force brute
email, ipAddress, success, createdAt. Index sur (email, date) et (ip, date).
Règle : 5 échecs / 15 min par e-mail, 20 par IP. Purge au-delà de 24 h.

#### `categories`
| Champ | Rôle |
|---|---|
| slug (**unique**) | adresse `/blog/categorie/[slug]` |
| name | nom affiché |
| icon | liste fermée : lotus, sparkles, heart, leaf, feather, lightbulb |
| position | ordre des filtres |

#### `tags` et `article_tags`
- `tags` : slug et nom **uniques**.
- `article_tags` : table de liaison (clé = article + tag). Supprimer un article ou un tag supprime le lien.

#### `articles` – le cœur du blog
| Champ | Rôle |
|---|---|
| slug (**unique**) | adresse `/blog/[slug]` (réservés : page, categorie, recherche, nouveau) |
| title, excerpt | titre et chapô (meta description par défaut) |
| content (**JSON**) | document Tiptap, rendu par le composant `RichText` – jamais de HTML brut (pas de faille XSS) |
| status | `DRAFT` / `SCHEDULED` / `PUBLISHED` |
| publishedAt | date de publication (passée) ou programmée (future) |
| deletedAt | corbeille (suppression douce) |
| readingMinutes | calculé à l'enregistrement (~200 mots/min) |
| viewCount | compteur de lectures (« les plus lus ») |
| categoryId | → `categories` – **Restrict** : une catégorie avec des articles ne peut pas être supprimée |
| coverId, ogImageId | → `media` – **SetNull** : supprimer l'image ne casse pas l'article |
| authorId | → `users` (SetNull) |
| metaTitle, metaDescription, focusKeyword, canonicalUrl | réglages SEO |

Index : (status, publishedAt), (categoryId, publishedAt), (deletedAt).
**Visible sur le site** = statut PUBLISHED ou SCHEDULED, date atteinte, pas à la corbeille.

#### `media` – bibliothèque d'images
filename (nom d'origine, affiché), storageKey (**unique**, nom généré), url, mimeType, sizeBytes, width, height, alt, uploadedById, createdAt.
Le fichier lui-même est sur le stockage (aujourd'hui : dossier `storage/uploads`).

#### `contacts` – demandes du formulaire
name, email, phone (facultatif), subject, message, status (`NEW` / `IN_PROGRESS` / `DONE`), dates.
Index : (status, date) et (date). Règle RGPD décidée : suppression au bout de 12 mois.

#### `settings` – paramètres du site (une seule ligne, id = 1)
Nom, slogan, description, téléphone, e-mail public, ville, horaires, Instagram, Facebook, LinkedIn, e-mail de notification.

### Migrations
1. `20261103205310_init` – création des tables.
2. `20261103211549_nextauth_session_version` – ajout de `sessionVersion`, retrait de la table `sessions` (inutile avec les JWT).

Règle : toute modification passe par `npx prisma migrate dev`, jamais `db push` en production.

### Base locale
- Postgres.app, base `lyshannti`, utilisateur dédié `lyshannti` (pas le compte du Mac).
- Identifiants uniquement dans `.env` (jamais sur GitHub).
- Remplissage : `npx prisma db seed` (admin, paramètres, catégories + démo : articles, tags, contacts). Relançable sans doublons, refusé en production.

---

## 3. Pages

### Site public
| Adresse | Contenu |
|---|---|
| `/` | accueil |
| `/prestations` | soins énergétiques, 6 bienfaits, citation |
| `/a-propos` | histoire, valeurs |
| `/contact` | coordonnées (depuis les paramètres), carte de Cholet, formulaire |
| `/blog` + `/blog/page/n` | liste paginée (6 par page) |
| `/blog/categorie/[slug]` (+ pages) | articles d'une catégorie |
| `/blog/recherche?q=` | recherche (non indexée par Google) |
| `/blog/[slug]` | article |
| `/mentions-legales`, `/politique-de-confidentialite`, `/cookies` | pages vides à rédiger |

### Administration
| Adresse | Contenu |
|---|---|
| `/admin/connexion`, `/mot-de-passe-oublie`, `/reinitialiser` | accès |
| `/admin` | tableau de bord |
| `/admin/articles`, `/nouveau`, `/[id]` | liste, création, modification |
| `/admin/medias` | bibliothèque d'images |
| `/admin/categories` | catégories et tags |
| `/admin/contacts`, `/[id]` | demandes de contact |
| `/admin/parametres` | paramètres du site |
| `/admin/profil` | compte, mot de passe, déconnexion partout |

### Routes techniques
- `/api/auth/*` – NextAuth (connexion, déconnexion, session).
- `/media/[key]` – sert les images envoyées (cache longue durée).
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/icon.svg`.

---

## 4. Organisation du code

```
prisma/              schéma, migrations, seed
src/app/(site)/      pages publiques (avec header / footer)
src/app/admin/       (auth) pages de connexion · (dashboard) back-office
src/components/      composants par zone : home, blog, admin, layout, brand…
src/lib/
  db.ts              connexion Prisma (serveur uniquement)
  blog.ts            point d'entrée des données du blog
  blog-db.ts         … lues en base
  blog-demo.ts       … de démonstration (sans base)
  admin/*.ts         données de l'admin · admin-db.ts = requêtes en base
  admin/actions/     actions serveur de l'admin (écriture)
  actions/           actions serveur publiques (contact, mot de passe)
  auth/              NextAuth, session, limitation des tentatives
  storage/           stockage des fichiers (pilote disque local)
  email/             envoi d'e-mails (Resend)
  validations/       schémas Zod
src/proxy.ts         première barrière de /admin
```

**Règle des données** : avec `DATABASE_URL` → PostgreSQL ; sans → données de démo (build GitHub Pages).
**Règle navigateur** : les composants « use client » n'importent jamais `db`, `blog.ts` ni `admin/*.ts` (seulement `blog-types`, `blog-urls`, `admin/labels`).

---

## 5. Sécurité

| Sujet | En place |
|---|---|
| Mots de passe | bcrypt coût 12, jamais en clair, 12 caractères minimum |
| Sessions | JWT dans un cookie httpOnly / SameSite=Lax / Secure en HTTPS ; 8 h (7 jours avec « Se souvenir de moi ») ; `sessionVersion` revérifié en base à chaque requête |
| Connexion | messages génériques, 5 essais / 15 min, comparaison même si l'e-mail n'existe pas (pas de fuite par le temps de réponse) |
| Mot de passe oublié | réponse identique que le compte existe ou non, jeton haché, usage unique, 30 min, toutes sessions fermées après changement |
| Protection de l'admin | `proxy.ts` + `requireAdmin()` dans le layout ET dans chaque action serveur |
| Écritures | validation Zod côté serveur, régénération des pages (revalidatePath) |
| Contenu des articles | JSON rendu par des composants React, liens filtrés (pas de `javascript:`) |
| Images | type vérifié dans le contenu, 10 Mo max, ré-encodage WebP, EXIF/GPS retirés, nom généré |
| Formulaire de contact | champ piège anti-robots, 5 envois / 10 min par visiteur |
| En-têtes HTTP | HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy |
| Secrets | `.env` non versionné, `.env.example` documenté |

---

## 6. SEO et performances
- Balises complètes par page (titre, description, canonical, Open Graph, Twitter), image de partage.
- Sitemap avec catégories et articles (date de modification), robots.txt.
- Données structurées : WebSite, Organization, BlogPosting, BreadcrumbList.
- Pages publiques pré-générées et régénérées à chaque publication (et toutes les 5 min pour les articles programmés).
- JavaScript public léger (~150 Ko compressés, dont ~120 Ko de socle React/Next) ; aucun code de l'admin chargé côté public.
- Aucun cookie ni traceur sur le site public (pas de bandeau cookies nécessaire aujourd'hui).

---

## 7. Décisions prises
- NextAuth v4 conservé (1 à 2 comptes admin).
- Formulaire de contact : e-mail + copie en base + page Contacts légère, suppression à 12 mois.
- Démo GitHub Pages figée (lancement manuel).
- Vouvoiement sur tout le site.

## 8. Reste à faire

**Avant la mise en ligne**
1. Choisir l'hébergeur : Vercel Pro (~20 €/mois, zéro maintenance) ou VPS (~5–10 €/mois + maintenance).
2. Resend : vérifier le domaine, `EMAIL_FROM`, **nouvelle clé** (l'actuelle a été exposée).
3. Stockage des images en ligne (R2 / Vercel Blob / disque du VPS).
4. Tâches planifiées : suppression des contacts à 12 mois, vidage de la corbeille à 30 jours.
5. Retirer le mode démo et la configuration GitHub Pages.
6. Politique de sécurité du contenu (CSP), sauvegardes de la base, analyse `npm audit`.

**Points techniques relevés à la relecture**
- `viewCount` (« les plus lus ») n'est pas encore incrémenté à la lecture d'un article.
- `canonicalUrl` et l'image de partage par article (`ogImageId`) existent en base mais ne sont pas encore modifiables dans l'éditeur.
- Recherche du blog : simple (titre et chapô) ; à faire évoluer vers la recherche plein texte PostgreSQL en français.
- Limite par IP : repose sur l'en-tête `X-Forwarded-For` fourni par l'hébergeur.

**Contenus à fournir**
- Textes de l'accueil alignés sur les soins énergétiques, liste des vrais soins.
- Pages légales (raison sociale, SIRET, hébergeur…).
- Vraies photos, coordonnées, réseaux sociaux, domaine.
