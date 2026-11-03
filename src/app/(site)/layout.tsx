import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-plum"
      >
        Aller au contenu
      </a>
      <Header />
      {children}
      <Footer />
    </>
  );
}
