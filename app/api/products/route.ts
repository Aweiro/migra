import { productSchema } from "@/lib/validations/product";
import { createProduct } from "@/services/product.service";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = productSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const product = await createProduct(result.data);

    return Response.json({ product }, { status: 201 });
  } catch {
    return Response.json(
      {
        error: "Product could not be created",
      },
      { status: 500 },
    );
  }
}
