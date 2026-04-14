import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";

import Link from "next/link";

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
        <div className="py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
            <div className="max-w-5xl mx-auto relative z-10">
                <div className="mb-8">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4 group"
                    >
                        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
                        Back_to_Products
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight dark:text-white">Edit Product</h1>
                    <p className="text-sm text-gray-500 mt-2">{product.name}</p>
                </div>
                <EditProductForm product={product} categories={categories} brands={brands} />
            </div>
        </div>
    );
}
