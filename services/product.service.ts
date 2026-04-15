import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const productInclude = {
  subcategory: {
    include: {
      category: true,
    },
  },
} satisfies Prisma.ProductInclude;

export type CreateProductInput = Omit<
  Prisma.ProductUncheckedCreateInput,
  "id" | "createdAt" | "updatedAt" | "orderItems"
>;

export async function getProducts(categoryId?: string) {
  const where: any = { isActive: true };
  if (categoryId) {
    where.subcategory = { categoryId };
  }
  return prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: productInclude,
  });
}

export async function createProduct(data: CreateProductInput) {
  return prisma.product.create({
    data,
    include: productInclude,
  });
}
