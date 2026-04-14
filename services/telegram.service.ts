import type { CheckoutInput } from "@/lib/validations/checkout";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export function formatOrderMessage(data: CheckoutInput) {
  const items = data.items
    .map(
      (item, index) =>
        `${index + 1}. Product: ${item.productId}\nQuantity: ${item.quantity}\nPrice: ${formatPrice(item.price)}\nTotal: ${formatPrice(item.price * item.quantity)}`,
    )
    .join("\n\n");
  const total = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return `New order\n\nName: ${data.name}\nPhone: ${data.phone}\n\nItems:\n${items}\n\nTotal: ${formatPrice(total)}`;
}

export async function sendOrderToTelegram(data: CheckoutInput) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram configuration is missing");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatOrderMessage(data),
    }),
  });

  if (!response.ok) {
    throw new Error("Telegram message could not be sent");
  }
}
