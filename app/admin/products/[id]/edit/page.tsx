import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const [product, categories, brandsData] = await Promise.all([
        prisma.product.findUnique({
            where: { id: resolvedParams.id },
            include: { subcategory: true },
        }),
        prisma.category.findMany({
            include: { subcategories: { select: { id: true, name: true } } },
        }),
        prisma.product.findMany({
            select: { brand: true },
            where: { brand: { not: null } },
            distinct: ['brand']
        })
    ]);

    const brands = brandsData.map(b => b.brand) as string[];

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-[#0a0a0a] transition-colors relative">
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
            <div className="max-w-5xl mx-auto relative z-10">
                <EditProductForm product={product} categories={categories} />
            </div>
        </div>
    );
}
