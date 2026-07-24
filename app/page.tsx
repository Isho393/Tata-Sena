import { getAllProducts } from "@/lib/db";
import StorefrontClient from "@/components/StorefrontClient";

export const revalidate = 0;

export default async function Home() {
  const products = await getAllProducts();
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return <StorefrontClient products={products} featured={featured} />;
}
