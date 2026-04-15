import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "../../../categories/create/CategoryForm";

export default async function EditSubcategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    const [subcategory, categories] = await Promise.all([
        prisma.subcategory.findUnique({
            where: { id: resolvedParams.id },
        }),
        prisma.category.findMany({
            select: { id: true, name: true }
        })
    ]);

    if (!subcategory) {
        notFound();
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-[#0a0a0a] transition-colors relative">
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none" />
            <div className="max-w-5xl mx-auto relative z-10">
                <CategoryForm item={subcategory} categories={categories} />
            </div>
        </div>
    );
}
