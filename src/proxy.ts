import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Première barrière de l'admin : sans cookie de session valide, on renvoie vers
// la connexion. Ce n'est PAS la seule protection : chaque page et chaque action
// de l'admin revérifie la session en base (src/lib/auth/session.ts).

const PUBLIC_ADMIN_PATHS = ["/admin/connexion", "/admin/mot-de-passe-oublie", "/admin/reinitialiser"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (token) return NextResponse.next();

  const login = new URL("/admin/connexion/", request.url);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*"],
};
