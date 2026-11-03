// Champs ajoutés aux types de NextAuth v4 (compte admin et JWT).
import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    sessionVersion: number
    remember: boolean
  }
  interface Session {
    user: { id: string; name?: string | null; email?: string | null }
    sessionVersion: number
    /** Vrai si la durée de session (8 h sans « Se souvenir de moi ») est dépassée. */
    expired: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sessionVersion?: number
    remember?: boolean
    loginAt?: number
  }
}
