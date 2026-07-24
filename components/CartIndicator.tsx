"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartIndicator() {
  const { totalCount } = useCart();

  return (
    <Link
      href="/panier"
      className="relative text-ink-500 hover:text-accent-600 transition-colors"
      aria-label="Voir le panier"
    >
      Panier
      {totalCount > 0 && (
        <span className="absolute -top-2.5 -right-3.5 bg-accent-500 text-white text-[10px] leading-none rounded-full w-5 h-5 flex items-center justify-center">
          {totalCount}
        </span>
      )}
    </Link>
  );
}
