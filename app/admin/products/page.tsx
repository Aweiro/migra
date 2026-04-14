import { getProducts } from "@/services/product.service";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
    title: "Products Admin | Dashboard",
};

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ categoryId?: string }>;
}) {
    const resolvedParams = await searchParams;
    const { categoryId } = resolvedParams;

    const [products, categories] = await Promise.all([
        getProducts(categoryId),
        prisma.category.findMany({ orderBy: { name: 'asc' } })
    ]);

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Background Decor */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Products Management
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Manage your store catalog, pricing, and inventory.
                        </p>
                    </div>
                    <Link
                        href="/admin/products/create"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    <Link
                        href="/admin/products"
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${!categoryId
                            ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                            : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10"
                            }`}
                    >
                        All Categories
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/admin/products?categoryId=${cat.id}`}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${categoryId === cat.id
                                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                                : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10"
                                }`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Pricing</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No products found in this category.
                                        </td>
                                    </tr>
                                )}
                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 relative border border-gray-200 dark:border-gray-700">
                                                    {product.images?.[0] ? (
                                                        <img
                                                            src={product.images[0]}
                                                            className="w-full h-full object-cover"
                                                            alt={product.name}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                                                            No Img
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {product.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                {product.subcategory?.category?.name} &rarr; {product.subcategory?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                ${Number(product.price).toFixed(2)}
                                            </div>
                                            {Number(product.discountPercent) > 0 && (
                                                <div className="text-xs text-green-600 dark:text-green-400 mt-0.5 font-medium">
                                                    -{Number(product.discountPercent)}% Off
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
