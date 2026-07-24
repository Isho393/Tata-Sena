"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product, ProductInput } from "@/lib/db";

const EMPTY: ProductInput = {
  name: "",
  description: "",
  price: 0,
  image_url: "",
  category: "",
  stock: 0,
  featured: false,
};

export default function AdminPanel({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState<ProductInput>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setError(null);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      image_url: p.image_url,
      category: p.category,
      stock: p.stock,
      featured: p.featured,
    });
    setError(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image_url: form.image_url.trim(),
      category: form.category.trim(),
      stock: Number(form.stock),
      featured: form.featured,
    };

    if (!payload.name || !payload.description || !payload.image_url || !payload.category) {
      setError("Tous les champs sauf « Coup de cœur » sont obligatoires.");
      setSaving(false);
      return;
    }
    if (payload.price < 0 || payload.stock < 0) {
      setError("Le prix et le stock ne peuvent pas être négatifs.");
      setSaving(false);
      return;
    }

    const res = editingId
      ? await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const body = await res.json();

    if (!res.ok) {
      setError(body.message ?? "Une erreur est survenue.");
      setSaving(false);
      return;
    }

    const saved = body as Product;
    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? saved : p)));
    } else {
      setProducts((prev) => [saved, ...prev]);
    }
    reset();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement cet article ?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json();
      setError(body.message ?? "Une erreur est survenue.");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) reset();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink-900">Espace administrateur</h1>
          <p className="text-ink-500 mt-2">
            Ajoutez, modifiez ou supprimez les articles de la boutique.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="shrink-0 text-sm px-4 py-2.5 border border-ink-200 text-ink-600 hover:bg-ink-50 transition-colors"
        >
          Se déconnecter
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-ink-100 p-6 sticky top-24">
            <h2 className="font-serif text-2xl text-ink-900 mb-1">
              {editingId ? "Modifier l'article" : "Nouvel article"}
            </h2>
            <p className="text-sm text-ink-400 mb-6">
              {editingId
                ? "Mettez à jour les informations ci-dessous."
                : "Renseignez les informations du nouvel article."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nom de l'article">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="admin-input"
                  placeholder="Veste en lin beige"
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder="Description de l'article…"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Prix (€)">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    className="admin-input"
                    placeholder="89.00"
                  />
                </Field>
                <Field label="Stock">
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: Number(e.target.value) })
                    }
                    className="admin-input"
                    placeholder="10"
                  />
                </Field>
              </div>

              <Field label="Catégorie">
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="admin-input"
                  placeholder="Vêtements"
                />
              </Field>

              <Field label="URL de l'image">
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="admin-input"
                  placeholder="https://images.pexels.com/…"
                />
              </Field>

              {form.image_url && (
                <div className="relative aspect-[4/3] bg-ink-100 overflow-hidden">
                  <Image
                    src={form.image_url}
                    alt="Aperçu"
                    fill
                    sizes="100%"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="w-4 h-4 accent-accent-500"
                />
                <span className="text-sm text-ink-700">
                  Mettre en avant (coup de cœur)
                </span>
              </label>

              {error && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-ink-900 text-white py-3 text-sm tracking-wide hover:bg-accent-600 transition-colors disabled:opacity-50"
                >
                  {saving
                    ? "Enregistrement…"
                    : editingId
                    ? "Enregistrer les modifications"
                    : "Ajouter l'article"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={reset}
                    className="px-5 py-3 text-sm text-ink-600 border border-ink-200 hover:bg-ink-50 transition-colors"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-3">
          <h2 className="font-serif text-2xl text-ink-900 mb-4">
            Articles ({products.length})
          </h2>

          {products.length === 0 ? (
            <div className="border border-dashed border-ink-200 p-12 text-center text-ink-400">
              Aucun article pour l&apos;instant. Ajoutez-en un à l&apos;aide du formulaire.
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white border p-4 flex gap-4 items-center transition-colors ${
                    editingId === p.id
                      ? "border-accent-400 ring-1 ring-accent-200"
                      : "border-ink-100"
                  }`}
                >
                  <div className="relative w-20 h-24 shrink-0 bg-ink-100 overflow-hidden">
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg text-ink-900 truncate">
                        {p.name}
                      </h3>
                      {p.featured && (
                        <span className="text-[10px] bg-accent-100 text-accent-700 px-2 py-0.5 tracking-wide uppercase">
                          Coup de cœur
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink-400 truncate">{p.category}</p>
                    <p className="text-sm text-ink-600 mt-1">
                      {p.price.toFixed(2)} € · stock {p.stock}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-sm px-4 py-2 border border-ink-200 text-ink-700 hover:bg-ink-50 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-sm px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-ink-600 mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
