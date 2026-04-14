import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
    title: "Categories Admin | Dashboard",
};

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            subcategories: {
                include: {
                    _count: {
                        select: { products: true }
                    }
                }
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Categories Management
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Structure your store catalog by grouping products logically.
                        </p>
                    </div>
                    <Link
                        href="/admin/categories/create"
                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Category
                    </Link>
                </div>

                <div className="space-y-6">
                    {categories.length === 0 && (
                        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                No categories found. Start by creating your first category!
                            </p>
                        </div>
                    )}

                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm"
                        >
                            {/* Category Header */}
                            <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mr-2">
                                        /{category.slug}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-xs font-medium text-gray-400">
                                        {category.subcategories.length} subcategories
                                    </div>
                                    <Link
                                        href={`/admin/categories/${category.id}/edit`}
                                        className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit
                                    </Link>
                                </div>
                            </div>

                            {/* Subcategories List */}
                            <div className="p-4 sm:p-6">
                                {category.subcategories.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic px-2">No subcategories yet.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {category.subcategories.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-black/20 hover:border-teal-500/30 transition-colors group flex justify-between items-center"
                                            >
                                                <div>
                                                    <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                        {sub.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">/{sub.slug}</div>
                                                    <div className="text-xs text-gray-400 mt-1 text-teal-600 dark:text-teal-400">{sub._count.products} items</div>
                                                </div>
                                                <Link
                                                    href={`/admin/subcategories/${sub.id}/edit`}
                                                    className="p-2 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                                    title="Edit Subcategory"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
