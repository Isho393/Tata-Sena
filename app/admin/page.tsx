import { getAllProducts } from "@/lib/db";
import AdminPanel from "@/components/AdminPanel";

export const revalidate = 0;

export default async function AdminPage() {
  const products = await getAllProducts();

  return <AdminPanel initialProducts={products} />;
}
