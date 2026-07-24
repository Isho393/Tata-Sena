import type { CartItem } from "@/components/CartContext";

export function buildWhatsAppOrderLink(
  items: CartItem[],
  totalPrice: number
): string | null {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(
    /[^0-9]/g,
    ""
  );
  if (!number) return null;

  const lines = items.map(
    (it) => `- ${it.qty}x ${it.name} — ${(it.qty * it.price).toFixed(2)} €`
  );
  const message = [
    "Bonjour ! Je souhaite commander :",
    "",
    ...lines,
    "",
    `Total : ${totalPrice.toFixed(2)} €`,
  ].join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
