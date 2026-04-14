import { prisma } from "@/lib/prisma";
import CategoryForm from "./CategoryForm";

export const metadata = {
    title: "Create Category | Admin Panel",
};

export default async function CreateCategoryPage() {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-[#0a0a0a] transition-colors relative overflow-hidden">
            {/* Abstract Background Design */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-20 -left-20 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

            <div className="relative z-10 w-full">
                <CategoryForm categories={categories} />
            </div>
        </div>
    );
}
