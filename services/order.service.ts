import { prisma } from "@/lib/prisma";
import type { CheckoutInput } from "@/lib/validations/checkout";

export async function createOrder(data: CheckoutInput) {
  const subtotal = data.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return prisma.order.create({
    data: {
      customerName: data.name,
      customerPhone: data.phone,
      subtotal,
      discountTotal: 0,
      total: subtotal,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.price,
          discountAmount: 0,
          total: item.price * item.quantity,
        })),
      },
    },
    include: {
      items: true,
    },
  });
}
