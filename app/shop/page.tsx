import { Storefront } from "@/components/Storefront";
import Link from "next/link";
import Image from "next/image";
import { getServerTranslation } from "@/lib/i18n/server";

export const metadata = {
    title: "Shop Library | MIGRA",
    description: "Browse our entire collection of premium products.",
};

export default async function ShopLibraryPage({ searchParams }: { searchParams: Promise<any> }) {
    const resolvedSearchParams = await searchParams;
    const { t } = await getServerTranslation();
    return (
        <div className="min-h-screen bg-white">
            <div className="relative h-[200px] w-full overflow-hidden flex flex-col md:flex-row border-b border-black/[0.03]">
                {/* Visual Side (Background on Mobile) */}
                <div className="absolute inset-0 md:relative md:flex-1 bg-zinc-100 overflow-hidden">
                    <Image
                        src="/shop_library_hero.png"
                        alt="Library Background"
                        fill
                        priority
                        className="object-cover transition-transform duration-[3000ms] hover:scale-105 grayscale contrast-125 brightness-90 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden" />
                </div>

                {/* Content Side (Overlay on Mobile) */}
                <div className="flex-1 md:flex-1 bg-transparent md:bg-white flex flex-col justify-end md:justify-center px-6 pb-4 md:px-20 border-l border-black/[0.03] relative">
                    {/* Background Text Overlay (Desktop Only) */}
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[12vw] font-black text-black/[0.02] uppercase tracking-tighter leading-none select-none pointer-events-none italic hidden md:block">
                        LIBRARY
                    </div>

                    <div className="relative z-10 space-y-4 md:space-y-6 pt-14 md:pt-0">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-black text-white/40 md:text-black/20 md:pt-2 md:border-t md:border-black/5">
                            <Link href="/" className="hover:text-white md:hover:text-black transition-colors">{t('common.archive')}</Link>
                            <span>/</span>
                            <span className="text-white md:text-black italic">{t('common.library')}</span>
                        </nav>

                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-[4vw] font-black text-white md:text-black tracking-tighter uppercase italic leading-[0.8]">
                                {t('common.shop_library')}
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40 md:text-black/40">2026_ARCHIVE</span>
                                <div className="w-8 h-[1px] bg-white/20 md:bg-black/10" />
                                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/20 md:text-black/10 italic">Context Collection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Storefront searchParams={resolvedSearchParams} hideHero={true} />
        </div>
    );
}
