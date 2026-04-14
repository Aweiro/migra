import { Storefront } from "@/components/Storefront";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Shop Library | MIGRA",
    description: "Browse our entire collection of premium products.",
};

export default async function ShopLibraryPage({ searchParams }: { searchParams: Promise<any> }) {
    const resolvedSearchParams = await searchParams;
    return (
        <div className="min-h-screen bg-white">
            <div className="relative h-[200px] md:h-[40vh] md:min-h-[300px] w-full overflow-hidden flex flex-col justify-end">
                <Image
                    src="/library_bg.png"
                    alt="Library Background"
                    fill
                    priority
                    className="object-cover transition-transform duration-[3000ms] hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 max-w-[1800px] w-full mx-auto px-6 pb-12">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 mb-8">
                        <Link href="/" className="hover:text-white transition-colors">Archive</Link>
                        <span>/</span>
                        <span className="text-white/80 italic">Library</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-white/20 pb-6">
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Library
                        </h1>
                        <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.3em] font-black text-white/40">
                            <span>Archive_Selection_26</span>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            <span className="text-white/60 text-sm">Context_Library</span>
                        </div>
                    </div>
                </div>
            </div>

            <Storefront searchParams={resolvedSearchParams} hideHero={true} />
        </div>
    );
}
