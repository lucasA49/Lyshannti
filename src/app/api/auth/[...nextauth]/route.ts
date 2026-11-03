import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth/options";

// Routes NextAuth (connexion, déconnexion, session, jeton CSRF).
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
