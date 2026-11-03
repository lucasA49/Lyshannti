import { STORAGE_KEY_PATTERN, storage } from "@/lib/storage";

// Sert les images de la bibliothèque (stockage local). Les noms de fichiers sont
// générés par le serveur et ne changent jamais : mise en cache longue durée.
export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!STORAGE_KEY_PATTERN.test(key)) return new Response("Introuvable", { status: 404 });

  const file = await storage.get(key);
  if (!file) return new Response("Introuvable", { status: 404 });

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
