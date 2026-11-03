import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/generated/prisma/client"

// Client Prisma unique pour toute l'application. Côté serveur uniquement :
// ne jamais importer ce fichier dans un composant « use client ».
// En développement, le rechargement à chaud recrée les modules : on garde
// l'instance sur globalThis pour ne pas ouvrir une connexion à chaque fois.

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL n'est pas défini (voir .env.example).")
  return new PrismaClient({ adapter: new PrismaPg(connectionString) })
}

export const db = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
