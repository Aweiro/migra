import { prisma } from "@/lib/prisma";
import CategoryForm from "./CategoryForm";

export const metadata = {
    title: "Create Category | Admin Panel",
};

import Link from "next/link";

export default async function CreateCategoryPage() {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Abstract Background Design */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-20 -left-20 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

            <div className="relative z-10 max-w-4xl">
                <div className="mb-8">
                    <Link
                        href="/admin/categories"
                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4 group"
                    >
                        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
                        Back_to_Categories
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight dark:text-white">Create Category</h1>
                </div>
                <CategoryForm categories={categories} />
            </div>
        </div>
    );
}
