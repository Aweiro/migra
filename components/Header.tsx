import { prisma } from "@/lib/prisma";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
    const categories = await prisma.category.findMany({
        include: {
            subcategories: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return <HeaderClient categories={categories} />;
}
