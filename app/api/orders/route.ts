import { createOrder } from "@/services/order.service";
import { sendOrderToTelegram } from "@/services/telegram.service";
import { checkoutSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = checkoutSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const order = await createOrder(result.data);
    await sendOrderToTelegram(result.data);

    return Response.json({ order }, { status: 201 });
  } catch {
    return Response.json(
      {
        error: "Order could not be submitted",
      },
      { status: 500 },
    );
  }
}
