"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleProductStatus(productId: string, currentStatus: boolean) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data: { isActive: !currentStatus },
        });

        revalidatePath("/admin/products");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Error toggling product status:", error);
        return { success: false, error: error.message };
    }
}
