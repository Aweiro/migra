import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "../../CategoryForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const [category, categories] = await Promise.all([
        prisma.category.findUnique({
            where: { id: resolvedParams.id },
        }),
        prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        })
    ]);

    if (!category) {
        notFound();
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-[#0a0a0a] transition-colors relative">
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none" />
            <div className="max-w-5xl mx-auto relative z-10">
                <CategoryForm item={category} categories={categories} />
            </div>
        </div>
    );
}
