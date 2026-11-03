// Configuration NextAuth v4 de l'espace d'administration.
//
// Sécurité (voir CLAUDE.md, « Décisions prises ») :
// - connexion e-mail + mot de passe (bcrypt), messages d'erreur génériques ;
// - limitation des tentatives (rate-limit.ts) ;
// - session = JWT chiffré dans un cookie httpOnly / SameSite=Lax / Secure en HTTPS ;
// - durée : 8 h, ou 7 jours avec « Se souvenir de moi » ;
// - `sessionVersion` revérifié en base à chaque requête (getAdminSession).

import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { isLoginBlocked, recordLoginAttempt } from "@/lib/auth/rate-limit"
import { db } from "@/lib/db"
import { loginSchema } from "@/lib/validations/auth"

export const SESSION_SHORT_MS = 8 * 60 * 60 * 1000
const SESSION_REMEMBER_S = 7 * 24 * 60 * 60

// Hash factice : comparer même quand l'e-mail n'existe pas, pour que le temps de
// réponse ne révèle pas quelles adresses ont un compte. Calculé une seule fois.
let dummyHash: Promise<string> | undefined
const getDummyHash = () => (dummyHash ??= bcrypt.hash("compte-inexistant", 12))

/** Codes d'erreur renvoyés au formulaire (affichés en message générique). */
export const AUTH_ERRORS = { invalid: "CredentialsSignin", blocked: "TooManyAttempts" } as const

function clientIp(headers: Record<string, string | string[] | undefined> | undefined) {
  const forwarded = headers?.["x-forwarded-for"]
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return value?.split(",")[0]?.trim() || "inconnue"
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: SESSION_REMEMBER_S },
  pages: { signIn: "/admin/connexion", error: "/admin/connexion" },
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        remember: { type: "text" },
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
          remember: credentials?.remember === "true",
        })
        if (!parsed.success) return null

        const email = parsed.data.email.toLowerCase()
        const ipAddress = clientIp(request?.headers)

        if (await isLoginBlocked(email, ipAddress)) throw new Error(AUTH_ERRORS.blocked)

        const user = await db.user.findUnique({ where: { email } })
        const valid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? (await getDummyHash()))
        await recordLoginAttempt(email, ipAddress, Boolean(user && valid))
        if (!user || !valid) return null

        await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          sessionVersion: user.sessionVersion,
          remember: parsed.data.remember,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // À la connexion : on mémorise l'identité, la version de session et la durée.
      if (user) {
        token.sub = user.id
        token.sessionVersion = user.sessionVersion
        token.remember = user.remember
        token.loginAt = Date.now()
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub ?? ""
      session.sessionVersion = token.sessionVersion ?? -1
      // Sans « Se souvenir de moi », la session expire au bout de 8 h.
      session.expired = !token.remember && Date.now() - (token.loginAt ?? 0) > SESSION_SHORT_MS
      return session
    },
  },
}
