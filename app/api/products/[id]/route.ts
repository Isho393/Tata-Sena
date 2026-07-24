import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, updateProduct, type ProductInput } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<ProductInput>;

  if (
    !body.name?.trim() ||
    !body.description?.trim() ||
    !body.image_url?.trim() ||
    !body.category?.trim()
  ) {
    return NextResponse.json(
      { message: "Tous les champs sauf « Coup de cœur » sont obligatoires." },
      { status: 400 }
    );
  }

  const price = Number(body.price);
  const stock = Number(body.stock);
  if (!Number.isFinite(price) || !Number.isFinite(stock) || price < 0 || stock < 0) {
    return NextResponse.json(
      { message: "Le prix et le stock ne peuvent pas être négatifs." },
      { status: 400 }
    );
  }

  const product = await updateProduct(id, {
    name: body.name.trim(),
    description: body.description.trim(),
    price,
    image_url: body.image_url.trim(),
    category: body.category.trim(),
    stock,
    featured: !!body.featured,
  });

  if (!product) {
    return NextResponse.json({ message: "Article introuvable." }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteProduct(id);
  if (!ok) {
    return NextResponse.json({ message: "Article introuvable." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
