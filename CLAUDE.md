@AGENTS.md

# PROJET LYSHANNTI – SITE WEB + BLOG + CRM

## Objectif
Développer un site web professionnel, élégant, responsive et optimisé SEO, intégrant un blog administrable et un espace d'administration CRM sécurisé.

## 1. Identité visuelle
Respecter strictement la palette :
- Prune : `#211325`
- Rose poudré : `#EED8D4`
- Or clair : `#F4D08A`

Style : élégant, premium, floral, moderne et épuré. Playfair Display pour les titres, Inter pour les textes (via `next/font/google`).

## 2. Pages publiques
- **Accueil :** présentation, prestations, valeurs, articles récents et appels à l'action.
- **Prestations :** présentation détaillée des services.
- **À propos :** histoire, parcours, valeurs et présentation.
- **Blog :** articles, catégories, recherche et pagination.
- **Article :** contenu riche, images, titres structurés et SEO.
- **Contact :** formulaire avec nom, email, téléphone, sujet et message.

## 3. Back-office / CRM
Espace sécurisé `/admin` comprenant :
- Dashboard avec statistiques.
- Gestion complète des articles (CRUD).
- Éditeur de texte riche Tiptap.
- Gestion des catégories et tags.
- Bibliothèque d'images.
- Paramètres SEO par article : Meta Title, Meta Description, slug, mot-clé principal, URL canonique, Open Graph et ALT.
- Gestion des demandes de contact : consultation, recherche, filtres et statuts (nouveau, en cours, traité).

## 4. Backend et base de données
PostgreSQL avec Prisma 7 (adaptateur `@prisma/adapter-pg`, config dans `prisma.config.ts`, client généré dans `src/generated/prisma`).

Tables principales : `users`, `articles`, `categories`, `tags`, `article_tags`, `media`, `contacts`, `settings`.

Les identifiants, dates, relations et contraintes doivent être correctement gérés par Prisma.

Le formulaire de contact enregistre les demandes en base et envoie une notification email via Resend.

## 5. Stack technique déjà installée
- Next.js 16.4.4 / React 19.3.0 / TypeScript
- Tailwind CSS 4
- shadcn/ui avec Base UI, style `base-nova` (composants dans `src/components/ui`, helper `cn` du paquet `cn`)
- Prisma 7 + PostgreSQL (`pg`)
- NextAuth `next-auth` v4 (pas Auth.js v5) + `bcryptjs`
- Tiptap 3
- Resend
- Zod 4 + React Hook Form
- Lucide React, Sonner, next-themes
- Sharp

Ne pas réinstaller les dépendances déjà présentes. Vérifier leur compatibilité avant toute configuration.

## 6. Exigences techniques
- Architecture modulaire et composants réutilisables.
- Responsive design mobile, tablette et desktop.
- SEO technique : métadonnées, sitemap, robots.txt, Schema.org, canonical et Open Graph.
- Sécurité : validation serveur, authentification, protection des routes et variables d'environnement.
- Respect du RGPD et accessibilité WCAG 2.2 AA.
- Optimisation des performances et des images.

## 7. Méthode de travail obligatoire
Ne pas commencer à coder immédiatement.

1. Analyser le projet et les dépendances existantes.
2. Vérifier la compatibilité des versions.
3. Proposer l'architecture technique.
4. Préparer l'arborescence.
5. Configurer PostgreSQL et Prisma.
6. Préparer le schéma de base de données.
7. Présenter une roadmap.
8. Attendre la validation de l'utilisateur avant de développer.

Ensuite, développer progressivement, fonctionnalité par fonctionnalité, en testant chaque étape.

Ne créer aucune fonctionnalité fictive. Ne rien supprimer sans validation.

## 8. Résultat attendu
Un site vitrine professionnel avec blog dynamique, espace administrateur sécurisé, CRM de gestion des contacts, système d'emails et référencement SEO.

Code propre, documenté, maintenable et évolutif.

**Priorités : qualité, sécurité, design, SEO et expérience utilisateur.**

## Conventions front
- Le nom de la marque s'écrit **Lyshannti** (avec deux n), même si la maquette écrit « Lyshanti ».
- Les couleurs de la marque sont des classes Tailwind : `plum`, `blush` et `gold` (définies dans `globals.css`). Polices : `font-heading` (Playfair) et `font-sans` (Inter).
- Boutons de la marque : `buttonVariants({ variant: "gold" | "outline-plum", size: "cta" })`.
- Le nom, la navigation et le CTA du site sont dans `src/config/site.ts`.
- Pages publiques dans `src/app/(site)/`, avec leur layout (header). Le futur `/admin` aura son propre layout.
- Composants : `src/components/layout/` (header, footer, container), `src/components/brand/` (logo, lotus), `src/components/home/` (sections de l'accueil).
- Tant que le backend n'est pas prêt, les données de démonstration sont dans des fichiers marqués comme provisoires.
- Toujours vérifier en mobile (390 px), tablette (768 px) et desktop.

## À fournir par l'utilisateur
- Les vraies photos (Hero, prestations, approche, articles) : pour l'instant ce sont des `ImagePlaceholder`.
- Les URL Instagram, Facebook et LinkedIn, dans `siteConfig.socials` : un réseau sans URL n'est pas affiché.
- Le contenu des pages légales (mentions légales, confidentialité, cookies) : les liens du footer existent déjà.
- Le nom de domaine définitif : nécessaire pour `metadataBase`, les URL canoniques, Open Graph, `sitemap.xml` et `robots.txt`.
- Les coordonnées réelles (téléphone, email, ville, horaires) : `siteConfig.contact` contient pour l'instant celles de la maquette.
- Les infos de l'activité (ville ou zone, adresse si cabinet, téléphone, horaires) : pour le titre SEO de l'accueil et les données structurées Schema.org.
- Un visuel de partage Open Graph (1200×630) et un favicon / logo en SVG ou PNG.

## SEO / SEA : reste à faire (audit de l'accueil)
- `metadataBase`, canonical, Open Graph et Twitter card sur toutes les pages (bloqué par le nom de domaine).
- `src/app/sitemap.ts` et `src/app/robots.ts` (bloqué par le nom de domaine).
- Données structurées JSON-LD `BeautySalon` / `LocalBusiness` (bloqué par les infos de l'activité).
- Titre SEO de l'accueil plus descriptif (ex. « Lyshannti – Soins visage, corps et accompagnement bien-être à <ville> »).
- Favicon et icônes à la marque (actuellement le favicon par défaut de Next).
- SEA : suivi des conversions (Google Ads / GA4) seulement avec un bandeau de consentement et le Consent Mode v2.
- Photos : `next/image` avec `priority` sur l'image du Hero (LCP), `sizes` adaptés, formats AVIF/WebP.

## Ordre de travail
Le projet est **au tout début de son développement** : le site n'est pas encore en ligne. Les points en attente (domaine, infos de l'activité, photos, analytics) seront traités plus tard. Ne pas bloquer l'avancement dessus ni les redemander à chaque étape.
Le **front** passe en premier. Le backend vient après. Attendre les instructions de l'utilisateur pour chaque étape.

## Sécurité et données – points à discuter avant le backend (ne rien coder sans validation)
La base de données va vivre longtemps (articles du blog) et l'admin se connecte pour les gérer.
- **Mots de passe** : hachage `bcryptjs` (le sel est généré et stocké automatiquement dans le hash, coût ≥ 12) ou argon2id. Jamais de mot de passe en clair ni de hash « maison ».
- **Sessions** : NextAuth v4 + Credentials impose des sessions JWT (cookie chiffré). Un JWT ne se révoque pas avant expiration → durée courte + `sessionVersion` en base, ou sessions en base (Better Auth). Décision à prendre.
- **Cookies / tokens** : httpOnly, Secure, SameSite=Lax, jamais dans `localStorage`. Secret d'auth long et aléatoire dans `.env`.
- **Connexion** : pas d'inscription publique (admin créé par un script de seed), limitation des tentatives (anti-brute-force), messages d'erreur génériques. 2FA en option.
- **Protection des routes** : `proxy.ts` (Next 16) pour rediriger, MAIS vérification de la session dans chaque Server Action / Route Handler (le proxy seul ne suffit pas).
- **Réinitialisation du mot de passe** : token aléatoire, haché en base, usage unique, expiration courte.
- **Contenu Tiptap** : assainir le HTML côté serveur avant enregistrement et affichage (XSS).
- **Uploads d'images** : vérifier type et taille, renommer, ne jamais exécuter.
- **Validation** : Zod côté serveur sur toutes les entrées ; Prisma protège des injections SQL.
- **Données durables** : `prisma migrate` (jamais `db push` en production), sauvegardes automatiques de la base, suppression douce (`deletedAt`) pour les articles.
- **En-têtes de sécurité** : CSP, HSTS, X-Frame-Options, etc.

## Backend – à revoir plus tard (ne pas traiter avant que l'utilisateur le demande)
Décisions ouvertes :
- Authentification : garder NextAuth v4 (stable, plus d'évolution) ou passer à Better Auth (moderne, bonne intégration Prisma).
- Stockage des images de la bibliothèque média (disque local, Vercel Blob, S3…).
- Source des statistiques du dashboard (données internes uniquement, ou outil d'analytics).
- Protection anti-spam du formulaire de contact (rate limiting, honeypot, captcha).
- Bandeau de consentement cookies (RGPD), nécessaire seulement si un outil d'analytics ou de suivi est ajouté.

Nettoyage des dépendances :
- `npm audit` signale des vulnérabilités, pas encore analysées. Ne pas lancer `npm audit fix --force` sans validation.
- `shadcn` est un outil en ligne de commande : il devrait être dans les `devDependencies`.
- Paquets en trop à retirer avec `npm prune` : `@emnapi/runtime`, `@img/sharp-wasm32`.

Déjà fait :
- `prisma7.config.ts` renommé en `prisma.config.ts` (`prisma validate` passe).
- `dotenv` ajouté aux `devDependencies`.
- Le schéma Prisma ne contient encore aucun modèle et aucune migration n'a été lancée.
