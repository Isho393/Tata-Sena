import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  featured: boolean;
  created_at: string;
};

export type ProductInput = Omit<Product, "id" | "created_at">;

type ProductRow = Omit<Product, "created_at"> & { created_at: string | Date };

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_URL env var. Link a Postgres database (Vercel Storage > Neon) and add it to .env.local for local dev."
    );
  }
  return url;
}

// Lazy: neon() must not run at module load time, since Next.js imports this
// module while collecting page data at build time, before DATABASE_URL exists.
let sqlClient: ReturnType<typeof neon> | null = null;
function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<Record<string, unknown>[]> {
  if (!sqlClient) sqlClient = neon(getConnectionString());
  return sqlClient(strings, ...values) as Promise<Record<string, unknown>[]>;
}

function toProduct(row: ProductRow): Product {
  return {
    ...row,
    created_at:
      row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}

let ready: Promise<void> | null = null;

// Lazily creates the schema and seeds it on first use. The count-then-insert
// check below isn't race-proof across concurrent cold starts hitting an empty
// table, but that only matters once (right after the DB is provisioned) and
// worst case is a few duplicate seed rows, easily removed from the admin panel.
function init(): Promise<void> {
  return (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price DOUBLE PRECISION NOT NULL,
        image_url TEXT NOT NULL,
        category TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        featured BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products (category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_featured ON products (featured)`;

    const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM products`;
    if (count === 0) {
      const seed: [string, string, number, string, string, number, boolean][] = [
        ["Veste en lin beige", "Veste légère en lin tissé, coupe droite, parfaite pour la mi-saison.", 89.0, "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg", "Vêtements", 12, true],
        ["Sac à main cuir camel", "Sac à main en cuir grainé, anses rondes, doublure coton.", 129.0, "https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg", "Accessoires", 5, true],
        ["Lunettes de soleil oversize", "Monture acétate noir mat, verres UV400, étui inclus.", 45.0, "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg", "Accessoires", 20, false],
        ["Chaussures cuir femme", "Ballerines en cuir souple, semelle gomme, confort toute la journée.", 75.0, "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg", "Chaussures", 8, false],
        ["Robe plissée bordeaux", "Robe midi plissée, tissu fluide, fermeture zip invisible.", 110.0, "https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg", "Vêtements", 7, true],
        ["Foulard soie imprimé", "Foulard carré en soie 100%, imprimé floral, finitions roulottées.", 39.0, "https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg", "Accessoires", 30, false],
      ];
      for (const [name, description, price, image_url, category, stock, featured] of seed) {
        await sql`
          INSERT INTO products (id, name, description, price, image_url, category, stock, featured)
          VALUES (${randomUUID()}, ${name}, ${description}, ${price}, ${image_url}, ${category}, ${stock}, ${featured})
        `;
      }
    }
  })();
}

function ensureReady(): Promise<void> {
  if (!ready) ready = init();
  return ready;
}

export async function getAllProducts(): Promise<Product[]> {
  await ensureReady();
  const rows = (await sql`SELECT * FROM products ORDER BY created_at DESC`) as ProductRow[];
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  await ensureReady();
  const rows = (await sql`SELECT * FROM products WHERE id = ${id}`) as ProductRow[];
  return rows[0] ? toProduct(rows[0]) : null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  await ensureReady();
  const rows = (await sql`
    INSERT INTO products (id, name, description, price, image_url, category, stock, featured)
    VALUES (${randomUUID()}, ${input.name}, ${input.description}, ${input.price}, ${input.image_url}, ${input.category}, ${input.stock}, ${input.featured})
    RETURNING *
  `) as ProductRow[];
  return toProduct(rows[0]);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  await ensureReady();
  const rows = (await sql`
    UPDATE products
    SET name = ${input.name}, description = ${input.description}, price = ${input.price},
        image_url = ${input.image_url}, category = ${input.category}, stock = ${input.stock},
        featured = ${input.featured}
    WHERE id = ${id}
    RETURNING *
  `) as ProductRow[];
  return rows[0] ? toProduct(rows[0]) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureReady();
  const rows = (await sql`DELETE FROM products WHERE id = ${id} RETURNING id`) as ProductRow[];
  return rows.length > 0;
}
