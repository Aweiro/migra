"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const menuItems = [
        {
            name: "Dashboard", href: "/admin", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h3a2 2 0 002-2v-4a1 1 0 011-1h2a1 1 0 011 1v4a2 2 0 002 2h3a2 2 0 002-2V10M9 21h6" />
                </svg>
            )
        },
        {
            name: "Products", href: "/admin/products", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            )
        },
        {
            name: "Categories", href: "/admin/categories", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-r border-gray-200 dark:border-white/10 p-6">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                        <span className="text-white dark:text-black font-black text-xs">M</span>
                    </div>
                    <span className="font-black tracking-tighter uppercase text-lg dark:text-white">Migra Admin</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${isActive
                                        ? "bg-black text-white shadow-xl shadow-black/10 dark:bg-white dark:text-black"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Store
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
                <span className="font-black tracking-tighter uppercase text-lg dark:text-white">Migra Admin</span>
                <Link
                    href="/"
                    className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                    Exit_Admin
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 lg:pl-72 pt-20 lg:pt-0">
                {children}
            </main>
        </div>
    );
}
