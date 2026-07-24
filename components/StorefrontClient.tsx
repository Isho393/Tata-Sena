"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/db";

export default function StorefrontClient({
  products,
  featured,
}: {
  products: Product[];
  featured: Product[];
}) {
  const categories = useMemo(() => {
    const set = new Set<string>(["Tout"]);
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const [active, setActive] = useState("Tout");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const inCat = active === "Tout" || p.category === active;
      const inSearch =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      return inCat && inSearch;
    });
  }, [products, active, query]);

  return (
    <div>
      {featured.length > 0 && (
        <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
          <Image
            src={featured[0].image_url}
            alt={featured[0].name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/20 to-transparent" />
          <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-16 animate-fade-up">
            <p className="text-ink-100/80 text-sm tracking-[0.3em] uppercase mb-3">
              Sélection de la semaine
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-white max-w-2xl leading-tight">
              {featured[0].name}
            </h1>
            <Link
              href={`/produit/${featured[0].id}`}
              className="mt-6 inline-flex w-fit items-center gap-2 bg-white text-ink-900 px-6 py-3 text-sm tracking-wide hover:bg-ink-50 transition-colors"
            >
              Découvrir →
            </Link>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-serif text-4xl text-ink-900">La boutique</h2>
            <p className="text-ink-500 mt-2">
              {filtered.length} article{filtered.length > 1 ? "s" : ""} disponible
              {filtered.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              placeholder="Rechercher…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2.5 bg-white border border-ink-100 text-sm text-ink-800 placeholder:text-ink-300 focus:outline-none focus:border-ink-400 transition-colors w-full sm:w-56"
            />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`px-4 py-2.5 text-sm whitespace-nowrap transition-colors border ${
                    active === c
                      ? "bg-ink-900 text-white border-ink-900"
                      : "bg-white text-ink-600 border-ink-100 hover:border-ink-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center text-ink-400 font-serif text-2xl italic">
            Aucun article ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, i) => (
              <Link
                key={p.id}
                href={`/produit/${p.id}`}
                className="group animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-ink-100">
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {p.stock === 0 && (
                    <span className="absolute top-3 left-3 bg-ink-900/90 text-white text-xs px-3 py-1 tracking-wide">
                      Épuisé
                    </span>
                  )}
                  {p.featured && p.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs px-3 py-1 tracking-wide">
                      Coup de cœur
                    </span>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-baseline">
                  <h3 className="font-serif text-xl text-ink-900 group-hover:text-accent-600 transition-colors">
                    {p.name}
                  </h3>
                  <span className="text-ink-700 font-medium">
                    {p.price.toFixed(2)} €
                  </span>
                </div>
                <p className="text-sm text-ink-400 mt-1">{p.category}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
