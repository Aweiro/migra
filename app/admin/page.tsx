import Link from "next/link";

export const metadata = {
    title: "Admin Dashboard | Store",
};

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-[#0a0a0a] transition-colors relative overflow-hidden">
            {/* Abstract Background Design */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-40 -left-40 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

            <div className="max-w-6xl mx-auto relative z-10 w-full">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-4">
                        Hello, Admin
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                        Welcome to your store's control center. Here you can manage your entire catalog, organize categories, and track business operations.
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Products Card */}
                    <Link
                        href="/admin/products"
                        className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-purple-500/50 shadow-sm hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-indigo-500/0 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/30">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Products</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                                Manage inventory, edit pricing, upload product showcases, and apply promotional discounts to your catalog.
                            </p>
                        </div>
                        <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            Open Products <span className="ml-2">→</span>
                        </div>
                    </Link>

                    {/* Categories Card */}
                    <Link
                        href="/admin/categories"
                        className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:border-teal-500/50 dark:hover:border-teal-500/50 shadow-sm hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/20 to-emerald-500/0 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-500/30">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Categories</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                                Organize your store by creating parent categories and distinct subcategories to keep the navigation accessible.
                            </p>
                        </div>
                        <div className="flex items-center text-teal-600 dark:text-teal-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            Open Categories <span className="ml-2">→</span>
                        </div>
                    </Link>

                    {/* Coming Soon: Orders */}
                    <div className="group relative flex flex-col justify-between p-8 rounded-3xl bg-gray-100/50 dark:bg-white/5 border border-transparent border-dashed dark:border-white/10 opacity-70 cursor-not-allowed">
                        <div className="relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gray-300 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                    Coming Soon
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Orders</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                                View new purchases, track shipping status, and handle customer requests right from your admin panel.
                            </p>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-500 font-semibold text-sm">
                            Locked <span className="ml-2">🔒</span>
                        </div>
                    </div>

                </div>

                {/* Quick Actions Bar */}
                <div className="mt-12 p-8 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jump straight into creation menus without opening lists.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link
                            href="/admin/products/create"
                            className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 font-semibold text-sm rounded-xl transition-all text-center"
                        >
                            + Add Product
                        </Link>
                        <Link
                            href="/admin/categories/create"
                            className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 font-semibold text-sm rounded-xl transition-all text-center"
                        >
                            + Add Category
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
