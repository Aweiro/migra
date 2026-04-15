import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  slug: z.string().trim().min(2, "Slug must be at least 2 characters"),
  description: z.string().trim().optional(),
  price: z.number().positive("Price must be greater than 0"),
  discountAmount: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
  images: z.array(z.string().url()).default([]),
  stock: z.number().int().min(0).default(0),
  subcategoryId: z.string().min(1, "Subcategory is required"),
});

export type ProductInput = z.infer<typeof productSchema>;
