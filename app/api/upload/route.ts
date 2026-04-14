import { uploadImage } from "@/services/cloudinary.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image");

  if (!(image instanceof File)) {
    return Response.json({ error: "Image is required" }, { status: 400 });
  }

  if (!image.type.startsWith("image/")) {
    return Response.json({ error: "File must be an image" }, { status: 400 });
  }

  try {
    const url = await uploadImage(image);

    return Response.json({ url }, { status: 201 });
  } catch {
    return Response.json({ error: "Image upload failed" }, { status: 500 });
  }
}
