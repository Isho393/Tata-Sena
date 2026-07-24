"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, updateQty, removeItem, clear, totalPrice } = useCart();
  const [notConfigured, setNotConfigured] = useState(false);

  const handleOrder = () => {
    const link = buildWhatsAppOrderLink(items, totalPrice);
    if (!link) {
      setNotConfigured(true);
      return;
    }
    window.open(link, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-ink-900 mb-3">
          Votre panier est vide
        </h1>
        <Link
          href="/"
          className="inline-block mt-4 text-accent-600 hover:text-accent-700 transition-colors"
        >
          Découvrir la boutique →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl text-ink-900 mb-8">Votre panier</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap gap-4 items-center border border-ink-100 p-4 bg-white"
          >
            <div className="relative w-20 h-24 shrink-0 bg-ink-100 overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-[8rem]">
              <h3 className="font-serif text-lg text-ink-900 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-ink-500">{item.price.toFixed(2)} €</p>
            </div>
            <div className="flex items-center border border-ink-200">
              <button
                onClick={() => updateQty(item.id, item.qty - 1)}
                className="px-3 py-2 text-ink-600 hover:bg-ink-50 transition-colors"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="px-3 py-2 min-w-[2.5rem] text-center">
                {item.qty}
              </span>
              <button
                onClick={() => updateQty(item.id, item.qty + 1)}
                disabled={item.qty >= item.stock}
                className="px-3 py-2 text-ink-600 hover:bg-ink-50 transition-colors disabled:opacity-30"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right text-ink-800 font-medium">
              {(item.price * item.qty).toFixed(2)} €
            </p>
            <button
              onClick={() => removeItem(item.id)}
              className="text-sm text-red-700 hover:text-red-900 transition-colors"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <p className="text-xl text-ink-900">
          Total : <span className="font-medium">{totalPrice.toFixed(2)} €</span>
        </p>

        {notConfigured && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 max-w-md text-right">
            Le numéro WhatsApp de la boutique n&apos;est pas configuré
            (NEXT_PUBLIC_WHATSAPP_NUMBER dans .env.local).
          </p>
        )}

        <p className="text-sm text-ink-400 max-w-md text-right">
          En commandant, une conversation WhatsApp s&apos;ouvre avec le récapitulatif
          de votre panier pour finaliser la commande avec la boutique.
        </p>

        <div className="flex gap-3">
          <button
            onClick={clear}
            className="px-5 py-3 text-sm text-ink-600 border border-ink-200 hover:bg-ink-50 transition-colors"
          >
            Vider le panier
          </button>
          <button
            onClick={handleOrder}
            className="bg-emerald-600 text-white px-8 py-3 text-sm tracking-wide hover:bg-emerald-700 transition-colors"
          >
            Commander via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
