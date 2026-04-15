import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
    title: "MIGRA_ADMIN // CATALOG_STRUCTURE",
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
        <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 md:px-6">
            {/* Header Ledger */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-20 gap-6 md:gap-8">
                <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-1 h-6 md:w-1.5 md:h-8 bg-black dark:bg-white" />
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.8]">
                            Catalog_Registry
                        </h1>
                    </div>
                    <p className="text-[9px] md:text-[10px] uppercase font-black tracking-[0.3em] text-black/40 dark:text-white/40 max-w-sm">
                        Sub-Entity Mapping Protocol // structural logic // v4.0.1
                    </p>
                </div>

                <Link
                    href="/admin/categories/create"
                    className="w-full md:w-auto px-6 md:px-10 py-4 md:py-5 bg-black dark:bg-white text-white dark:text-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center justify-center gap-4 md:gap-6 group border border-black dark:border-white whitespace-nowrap"
                >
                    <span>[+] Create_Node</span>
                    <svg className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </Link>
            </div>

            {/* Catalog Grid */}
            <div className="space-y-16">
                {categories.length === 0 && (
                    <div className="border border-black/10 dark:border-white/10 p-20 text-center bg-black/[0.01] dark:bg-white/[0.01]">
                        <p className="text-[10px] uppercase font-black tracking-[0.4em] text-black/20 dark:text-white/20">
                            No_Nodes_Detected // System_Idle
                        </p>
                    </div>
                )}

                {categories.map((category, index) => (
                    <div key={category.id} className="relative group">
                        {/* Vertical Index Marker */}
                        <div className="absolute -left-8 top-0 hidden xl:block">
                            <span className="text-[9px] font-black font-mono text-black/10 dark:text-white/10 rotate-90 inline-block origin-left">
                                NODE_{String(categories.length - index).padStart(3, "0")}
                            </span>
                        </div>

                        <div className="border border-black/20 dark:border-white/20">
                            {/* Category Header Bar */}
                            <div className="px-6 py-6 bg-black/[0.01] dark:bg-white/[0.01] border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-black uppercase tracking-tight text-black dark:text-white">
                                            {category.name}
                                        </h3>
                                        <span className="text-[8px] font-mono px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black font-bold">
                                            ROOT
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-mono text-black/40 dark:text-white/40">/{category.slug}</span>
                                        <span className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10" />
                                        <span className="text-[9px] uppercase font-black tracking-widest text-black/40 dark:text-white/40">
                                            Sub_Nodes: {category.subcategories.length}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={`/admin/categories/${category.id}/edit`}
                                    className="px-6 py-3 border border-black dark:border-white text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black whitespace-nowrap"
                                >
                                    Modify_Root_Protocol
                                </Link>
                            </div>

                            {/* Sub-Entities Grid */}
                            <div className="p-6 md:p-10">
                                {category.subcategories.length === 0 ? (
                                    <div className="py-10 text-center border border-dashed border-black/10 dark:border-white/10">
                                        <p className="text-[9px] uppercase font-black tracking-widest text-black/20 dark:text-white/20">
                                            __EMPTY_SUB_ARRAY__
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {category.subcategories.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="border border-black/10 dark:border-white/10 p-6 hover:border-black dark:hover:border-white transition-all bg-white dark:bg-zinc-900 group/sub relative shadow-sm"
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <div className="font-black text-[12px] uppercase tracking-wide text-black dark:text-white group-hover/sub:text-black/60 dark:group-hover/sub:text-white/60 transition-colors">
                                                                {sub.name}
                                                            </div>
                                                            <div className="text-[8px] font-mono text-black/30 dark:text-white/30 tracking-tighter">
                                                                ID: {sub.id.slice(0, 8).toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className="text-[10px] font-black font-mono text-black dark:text-white">
                                                            #{sub._count.products}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5 lg:opacity-0 lg:group-hover/sub:opacity-100 transition-opacity">
                                                        <span className="text-[8px] uppercase font-black tracking-widest text-black/40 dark:text-white/40">/{sub.slug}</span>
                                                        <Link
                                                            href={`/admin/subcategories/${sub.id}/edit`}
                                                            className="text-[9px] font-black uppercase text-black dark:text-white hover:underline underline-offset-4 decoration-2"
                                                        >
                                                            MOD_SUB
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Status Line */}
            <div className="mt-24 pt-8 border-t border-black/5 dark:border-white/5 flex justify-between items-center opacity-30">
                <span className="text-[8px] font-black uppercase tracking-[0.5em]">System_Catalog_End_Of_Ledger</span>
                <span className="text-[8px] font-mono uppercase">Total_Categories: {categories.length}</span>
            </div>
        </div>
    );
}
