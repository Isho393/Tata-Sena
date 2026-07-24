"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/db";
import { useCart } from "@/components/CartContext";

export default function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const inStock = product.stock > 0;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="text-sm text-ink-400 hover:text-ink-900 transition-colors mb-8 inline-block"
      >
        ← Retour à la boutique
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-100 animate-fade-up">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col animate-fade-up" style={{ animationDelay: "100ms" }}>
          <span className="text-xs tracking-[0.3em] uppercase text-accent-600 mb-3">
            {product.category}
          </span>
          <h1 className="font-serif text-4xl text-ink-900">{product.name}</h1>
          <p className="text-2xl text-ink-700 mt-3">
            {product.price.toFixed(2)} €
          </p>

          <div className="h-px bg-ink-100 my-6" />

          <p className="text-ink-600 leading-relaxed">{product.description}</p>

          <div className="mt-6 text-sm">
            {inStock ? (
              <span className="text-emerald-700">
                En stock — {product.stock} unité{product.stock > 1 ? "s" : ""} disponible
                {product.stock > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-red-700">Temporairement épuisé</span>
            )}
          </div>

          {inStock && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-ink-200">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-ink-600 hover:bg-ink-50 transition-colors"
                  aria-label="Diminuer la quantité"
                >
                  −
                </button>
                <span className="px-4 py-3 min-w-[3rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-3 text-ink-600 hover:bg-ink-50 transition-colors"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 bg-ink-900 text-white py-3.5 text-sm tracking-wide hover:bg-accent-600 transition-colors"
              >
                {added ? "Ajouté au panier ✓" : "Ajouter au panier"}
              </button>
            </div>
          )}

          <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-ink-500">
            <div className="border border-ink-100 p-4">
              <p className="font-medium text-ink-700 mb-1">Livraison</p>
              <p>Expédition sous 48h, gratuite dès 80 €.</p>
            </div>
            <div className="border border-ink-100 p-4">
              <p className="font-medium text-ink-700 mb-1">Retours</p>
              <p>30 jours pour changer d&apos;avis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
