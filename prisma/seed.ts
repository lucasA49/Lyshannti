// Remplit la base de DÉVELOPPEMENT : `npx prisma db seed`.
// Relançable sans risque (upsert) : ne crée pas de doublons.
//
// Toujours créé : le compte admin, les paramètres du site, les catégories.
// Données de démonstration (articles, tags, demandes de contact) : seulement si
// SEED_DEMO n'est pas « false ». Jamais de démo en production.
//
// Compte admin : SEED_ADMIN_EMAIL et SEED_ADMIN_PASSWORD (dans .env).

import "dotenv/config"
import bcrypt from "bcryptjs"
import { PrismaPg } from "@prisma/adapter-pg"

import { Prisma, PrismaClient } from "../src/generated/prisma/client"
import { demoContacts, demoPosts, demoTags } from "../src/content/admin.placeholder"
import { categoriesPlaceholder, postsPlaceholder } from "../src/content/posts.placeholder"
import { siteConfig } from "../src/config/site"
import { readingMinutes, type RichTextDoc } from "../src/lib/rich-text"

const db = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) })

const BCRYPT_COST = 12

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} manquant dans .env (voir .env.example).`)
  return value
}

async function seedAdmin() {
  const email = requireEnv("SEED_ADMIN_EMAIL").toLowerCase()
  const password = requireEnv("SEED_ADMIN_PASSWORD")
  if (password.length < 12) throw new Error("SEED_ADMIN_PASSWORD : 12 caractères minimum.")

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST)
  const admin = await db.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name: "Administratrice", passwordHash },
  })
  console.log(`✓ Compte admin : ${admin.email}`)
  return admin
}

async function seedSettings() {
  await db.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: siteConfig.name,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      phone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      city: siteConfig.contact.city,
      hours: siteConfig.contact.hours.short,
      instagramUrl: siteConfig.socials.instagram,
      facebookUrl: siteConfig.socials.facebook,
      linkedinUrl: siteConfig.socials.linkedin,
      notificationEmail: siteConfig.contact.email,
    },
  })
  console.log("✓ Paramètres du site")
}

async function seedCategories() {
  for (const [position, category] of categoriesPlaceholder.entries()) {
    await db.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: { slug: category.slug, name: category.name, icon: category.icon, position },
    })
  }
  console.log(`✓ ${categoriesPlaceholder.length} catégories`)
}

const demoParagraph = (text: string): RichTextDoc => ({
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text }] }],
})

async function seedDemoContent(authorId: string) {
  // Tags
  const tagNames = new Map<string, string>()
  for (const tag of demoTags) tagNames.set(tag.slug, tag.name)
  for (const post of postsPlaceholder) for (const tag of post.tags ?? []) tagNames.set(tag.slug, tag.name)
  for (const [slug, name] of tagNames) {
    await db.tag.upsert({ where: { slug }, update: {}, create: { slug, name } })
  }
  console.log(`✓ ${tagNames.size} tags`)

  // Articles : statuts et dates de l'admin, contenu complet quand il existe (« 5 gestes »).
  const categories = new Map((await db.category.findMany()).map((category) => [category.slug, category.id]))
  for (const post of demoPosts) {
    const full = postsPlaceholder.find((p) => p.slug === post.slug)
    const content =
      full?.content ?? demoParagraph("Contenu de démonstration : cet article sera rédigé depuis l'éditeur de l'admin.")
    const excerpt = full?.excerpt ?? `Article de démonstration : ${post.title}.`
    const tags = (full?.tags ?? []).map((tag) => ({ tag: { connect: { slug: tag.slug } } }))

    const data = {
      title: post.title,
      excerpt,
      content: content as unknown as Prisma.InputJsonValue,
      status: post.status,
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
      deletedAt: post.deletedAt ? new Date(post.deletedAt) : null,
      readingMinutes: full?.readingMinutes ?? readingMinutes(content),
      viewCount: post.views,
      category: { connect: { id: categories.get(post.category)! } },
      author: { connect: { id: authorId } },
    }

    await db.article.upsert({
      where: { slug: post.slug },
      update: {},
      create: { slug: post.slug, ...data, tags: { create: tags } },
    })
  }
  console.log(`✓ ${demoPosts.length} articles de démonstration`)

  // Demandes de contact (une seule fois : la table n'a pas de clé naturelle).
  if ((await db.contact.count()) === 0) {
    await db.contact.createMany({
      data: demoContacts.map(({ name, email, phone, subject, message, status, createdAt }) => ({
        name,
        email,
        phone,
        subject,
        message,
        status,
        createdAt: new Date(createdAt),
      })),
    })
    console.log(`✓ ${demoContacts.length} demandes de contact de démonstration`)
  } else {
    console.log("• Demandes de contact déjà présentes : inchangées")
  }
}

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Le seed de développement ne doit pas tourner en production.")

  const admin = await seedAdmin()
  await seedSettings()
  await seedCategories()
  if (process.env.SEED_DEMO !== "false") await seedDemoContent(admin.id)
}

main()
  .then(() => console.log("Base remplie."))
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
