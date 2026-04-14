import { prisma } from "@/lib/prisma";
import ProductForm from "./ProductForm";
import Link from "next/link";

export const metadata = {
    title: "Create Product | Admin Panel",
};

export default async function CreateProductPage() {
    const [categories, brandsData] = await Promise.all([
        prisma.category.findMany({
            include: {
                subcategories: {
                    select: { id: true, name: true },
                },
            },
        }),
        prisma.product.findMany({
            select: { brand: true },
            where: { brand: { not: null } },
            distinct: ['brand']
        })
    ]);

    const brands = brandsData.map(b => b.brand) as string[];

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Abstract Background Design */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

            <div className="relative z-10 max-w-4xl">
                <div className="mb-8">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4 group"
                    >
                        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
                        Back_to_Products
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight dark:text-white">Create New Product</h1>
                </div>
                <ProductForm categories={categories} brands={brands} />
            </div>
        </div>
    );
}
