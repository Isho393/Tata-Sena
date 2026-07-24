import { NextRequest, NextResponse } from "next/server";
import { createProduct, getAllProducts, type ProductInput } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await getAllProducts());
}

export async function POST(request: NextRequest) {
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

  const product = await createProduct({
    name: body.name.trim(),
    description: body.description.trim(),
    price,
    image_url: body.image_url.trim(),
    category: body.category.trim(),
    stock,
    featured: !!body.featured,
  });

  return NextResponse.json(product, { status: 201 });
}
