import type { Metadata } from "next";
import Link from "next/link";
import { CartProvider } from "@/components/CartContext";
import CartIndicator from "@/components/CartIndicator";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison Lumen — Boutique",
  description: "Boutique de vêtements et accessoires choisis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <header className="sticky top-0 z-30 backdrop-blur bg-ink-50/80 border-b border-ink-100">
            <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <Link href="/" className="font-serif text-2xl tracking-wide text-ink-900">
                Maison Lumen
              </Link>
              <div className="flex items-center gap-8 text-sm">
                <Link
                  href="/"
                  className="text-ink-600 hover:text-ink-900 transition-colors"
                >
                  Boutique
                </Link>
                <CartIndicator />
                <Link
                  href="/admin"
                  className="text-ink-500 hover:text-accent-600 transition-colors"
                >
                  Admin
                </Link>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-ink-100 mt-16">
            <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-ink-400 flex flex-col sm:flex-row justify-between gap-2">
              <span>© {new Date().getFullYear()} Maison Lumen</span>
              <span className="font-serif italic">L'élégance, au quotidien.</span>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
