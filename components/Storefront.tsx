import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { FilterBar } from "./FilterBar";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    discountPercent?: number | string;
    images: string[];
    sizes: string[];
    brand?: string;
}

export async function Storefront({
    categorySlug,
    subcategorySlug,
    searchParams,
    hideHero = false
}: {
    categorySlug?: string;
    subcategorySlug?: string;
    searchParams?: { [key: string]: string | string[] | undefined };
    hideHero?: boolean;
}) {
    const whereClause: any = {};

    if (subcategorySlug) {
        whereClause.subcategory = { slug: subcategorySlug };
    } else if (categorySlug) {
        whereClause.subcategory = {
            category: { slug: categorySlug }
        };
    }

    // Apply Filters
    const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'newest';
    const selectedSizes = typeof searchParams?.size === 'string' ? searchParams.size.split(',') : [];
    const selectedBrands = typeof searchParams?.brand === 'string' ? searchParams.brand.split(',') : [];

    if (selectedSizes.length > 0) {
        whereClause.sizes = {
            hasSome: selectedSizes
        };
    }

    if (selectedBrands.length > 0) {
        whereClause.brand = {
            in: selectedBrands
        };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    const rawProducts = await prisma.product.findMany({
        where: whereClause,
        include: {
            subcategory: {
                include: { category: true }
            }
        },
        orderBy
    });

    const products: Product[] = JSON.parse(JSON.stringify(rawProducts));

    // Get all sizes available for this category context (ignoring size filter)
    const baseWhereClause: any = {};
    if (subcategorySlug) {
        baseWhereClause.subcategory = { slug: subcategorySlug };
    } else if (categorySlug) {
        baseWhereClause.subcategory = { category: { slug: categorySlug } };
    }

    const rawFilterData = await prisma.product.findMany({
        where: baseWhereClause,
        select: { sizes: true, brand: true }
    });
    const filterData = JSON.parse(JSON.stringify(rawFilterData));
    const allSizes = Array.from(new Set(filterData.flatMap((p: any) => p.sizes))) as string[];
    const allBrands = Array.from(new Set(filterData.map((p: any) => p.brand).filter(Boolean))) as string[];

    // Sort them
    allSizes.sort();
    allBrands.sort();

    const popularProducts = products.slice(0, 4);

    let categoryData = null;
    let subcategoryData = null;

    if (subcategorySlug) {
        const rawSub = await prisma.subcategory.findUnique({
            where: { slug: subcategorySlug },
            include: { category: true }
        });
        subcategoryData = JSON.parse(JSON.stringify(rawSub));
    } else if (categorySlug) {
        const rawCat = await prisma.category.findUnique({
            where: { slug: categorySlug }
        });
        categoryData = JSON.parse(JSON.stringify(rawCat));
    }

    const currentTitle = subcategoryData?.name || categoryData?.name || "Collection";
    const currentBreadcrumb = subcategoryData
        ? `${subcategoryData.category.name} / ${subcategoryData.name}`
        : categoryData?.name;

    const categories = (!categorySlug && !subcategorySlug)
        ? await prisma.category.findMany({
            select: { id: true, name: true, slug: true, image: true },
            orderBy: { name: 'asc' }
        })
        : [];

    const tickerLogos = ["/brand1.png", "/brand2.png", "/brand3.png", "/brand4.png", "/brand5.png", "/brand6.png"];

    return (
        <main className="flex-1 bg-white">

            {/* Quality-Focused Split Hero (More compact) */}
            {!hideHero && (
                <div className="relative w-full overflow-hidden bg-[#f0f0f0] border-b border-black/[0.03]">
                    {!categorySlug && !subcategorySlug ? (
                        <div className="mx-auto max-w-[1800px] flex flex-col md:flex-row items-center relative">
                            {/* Decorative Info (Top Left) */}
                            <div className="absolute top-10 left-6 hidden xl:block">
                                <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] font-bold text-black/20">
                                    <span>Ref. 2026.SL01</span>
                                    <span className="w-8 h-[1px] bg-black/10"></span>
                                    <span>Contextual Library</span>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 px-6 py-12 md:py-24 z-10">
                                <div className="max-w-2xl relative">
                                    <div className="inline-flex items-center px-2 py-1 bg-black text-white text-[8px] uppercase tracking-[0.3em] font-bold mb-4 md:mb-8 animate-pulse">
                                        New Arrival / Jan '26
                                    </div>

                                    <h1 className="text-6xl md:text-[7vw] font-black text-black tracking-tighter leading-[0.8] mb-6 md:mb-10 uppercase italic">
                                        Pure <br /><span className="text-black/10 transition-colors duration-1000">Context</span>
                                    </h1>

                                    <p className="text-xs md:text-lg text-black/60 max-w-sm mb-8 md:mb-12 uppercase tracking-[0.2em] leading-relaxed font-light">
                                        Redefining the relationship between garment and environment. High-density basics engineered for the contemporary existence.
                                    </p>

                                    <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                                        <Link href="/shop" className="px-10 py-4 md:px-12 md:py-5 bg-black text-white text-[10px] md:text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-black/90 transform hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/10 text-center">
                                            Shop Library
                                        </Link>
                                        <button className="text-black text-[10px] md:text-[11px] uppercase font-bold tracking-[0.4em] border-b-2 border-black pb-1 hover:text-black/50 transition-colors">
                                            View Archives
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Image Content (Full height of the smaller panel) */}
                            <div className="flex-1 w-full h-[400px] md:h-[650px] relative bg-white">
                                <Image
                                    src="/hero_sharp.png"
                                    alt="MIGRA Contextual"
                                    fill
                                    priority
                                    quality={100}
                                    className="object-cover hover:scale-[1.05] transition-transform duration-[2000ms] ease-out"
                                />
                                {/* Texture Overlay */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grain-y.com/images/grain.png')] mix-blend-overlay" />

                                {/* Floating Metadata Card */}
                                <div className="absolute bottom-12 right-12 bg-white/40 backdrop-blur-xl border border-white/40 p-6 hidden lg:block">
                                    <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-black mb-1">Look No. 42</div>
                                    <div className="text-[10px] text-black/60 italic">"The Essential Uniform"</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-[1800px] flex flex-col md:flex-row items-stretch relative h-[200px] md:h-[200px] overflow-hidden group">
                            {/* Background Image / Desktop Panel */}
                            <div className="absolute inset-0 md:relative md:flex-1 bg-zinc-100 overflow-hidden">
                                {(subcategoryData?.category?.image || categoryData?.image) ? (
                                    <Image
                                        src={subcategoryData?.category?.image || categoryData?.image || ""}
                                        alt={currentTitle}
                                        fill
                                        className="object-cover transition-all duration-[2000ms] group-hover:scale-105 grayscale contrast-125 brightness-90 opacity-80 group-hover:opacity-100 group-hover:brightness-100"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-black/10 font-bold italic bg-zinc-50">
                                        Visual Archive
                                    </div>
                                )}
                                {/* Mobile Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden" />
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 md:flex-1 bg-transparent md:bg-white flex flex-col justify-end md:justify-center px-6 pb-4 md:px-20 border-l border-black/[0.03] overflow-hidden">
                                {/* Abstract background text - hidden on mobile */}
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[12vw] font-black text-black/[0.02] uppercase tracking-tighter leading-none select-none pointer-events-none italic hidden md:block">
                                    {currentTitle}
                                </div>

                                <div className="relative z-10 space-y-4 md:space-y-6">
                                    <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-black text-white/50 md:text-black/20 pt-2 md:border-t md:border-black/5">
                                        <Link href="/" className="hover:text-white md:hover:text-black transition-colors">Archive</Link>
                                        <span>/</span>
                                        <span className="text-white md:text-black">{currentBreadcrumb}</span>
                                    </nav>
                                    <div className="space-y-2">
                                        <h1 className="text-4xl md:text-[4vw] mb-4 font-black text-white md:text-black tracking-tighter uppercase italic leading-[0.8]">
                                            {currentTitle}
                                        </h1>

                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40 md:text-black/40">{products.length} OBJECTS</span>
                                            <div className="w-8 h-[1px] bg-white/20 md:bg-black/10" />
                                            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/20 md:text-black/10 italic">Context Library 26</span>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Brand Ticker */}
            {!hideHero && !categorySlug && !subcategorySlug && (
                <div className="w-full bg-white py-4 overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap flex items-center gap-2 md:gap-12">
                        {[...tickerLogos, ...tickerLogos].map((logo, i) => (
                            <div key={i} className="flex-shrink-0 h-10 md:h-18 w-24 md:w-56 relative grayscale opacity-40 hover:opacity-100 transition-opacity duration-300 transform hover:scale-110">
                                <Image
                                    src={logo}
                                    alt="Partner Brand"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Departments Section */}
            {!hideHero && !categorySlug && !subcategorySlug && categories.length > 0 && (
                <div className="mx-auto max-w-[1800px] px-6 mb-6">
                    <div className="flex items-end justify-between mb-16 border-b border-black pb-4">
                        <h3 className="text-[11px] uppercase tracking-[0.5em] font-black text-black">
                            Explore Departments
                        </h3>
                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Index / 01-0{categories.length}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat: any) => (
                            <Link
                                key={cat.id}
                                href={`/${cat.slug}`}
                                className="group relative aspect-[16/10] bg-[#f9f9f9] overflow-hidden"
                            >
                                {cat.image && (
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover grayscale-0 group-hover:grayscale opacity-100 transition-all duration-700 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-colors duration-500" />
                                <div className="absolute inset-0 p-10 flex flex-col justify-between">
                                    <span className="text-[10px] text-white/60 font-medium tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">Browse Store</span>
                                    <h4 className="text-white text-3xl font-black uppercase tracking-widest drop-shadow-lg">
                                        {cat.name}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Brand Philosophy Section (Inverse Hover: Color by default, BW on hover) */}
            {!hideHero && !categorySlug && !subcategorySlug && (
                <div className="bg-white py-24 md:py-32 mb-6 border-y border-black/5 relative z-20">
                    <div className="mx-auto max-w-[1800px] px-6">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="flex-1 relative order-2 md:order-1">
                                <div className="relative aspect-square w-full max-w-sm mx-auto group overflow-hidden shadow-2xl">
                                    <Image
                                        src="/philosophy.png"
                                        alt="Fabric Detail"
                                        fill
                                        className="object-cover grayscale-0 group-hover:grayscale transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 border-[15px] border-white/20 m-4 pointer-events-none" />
                                </div>
                                <div className="absolute -bottom-6 -right-6 hidden lg:block w-32 h-32 bg-black text-white p-6 flex items-center justify-center text-center shadow-xl z-30">
                                    <span className="text-[8px] uppercase tracking-[0.4em] font-bold leading-relaxed">Quality Over Quantity</span>
                                </div>
                            </div>
                            <div className="flex-1 order-1 md:order-2 space-y-6">
                                <span className="text-[10px] uppercase tracking-[0.6em] font-black text-black/30">The Philosophy</span>
                                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tighter uppercase leading-[0.9] text-black">
                                    Engineered <br />For The Long <br />Duration
                                </h3>
                                <div className="h-1 w-16 bg-black" />
                                <p className="text-base text-black/70 font-light leading-relaxed max-w-lg italic">
                                    "We don't create trends. We create containers for your personality. Every stitch is a deliberate choice. Every material is a long-term investment in your contextual library."
                                </p>
                                <div className="pt-6">
                                    <Link href="/about" className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-black hover:text-black/50 transition-colors">
                                        Read Our Story
                                        <span className="w-8 h-[1px] bg-black group-hover:w-16 transition-all duration-300" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            {(categorySlug || subcategorySlug || hideHero) && (
                <FilterBar allSizes={allSizes} allBrands={allBrands} />
            )}

            {/* Product Grid (Moved Up) */}
            <div className="mx-auto max-w-[1800px] px-6 pb-24">
                <div className="flex items-end justify-between mb-16 border-b border-black pb-4">
                    <h3 className="text-[11px] uppercase tracking-[0.5em] font-black text-black">
                        {products.length > 0 ? (categorySlug ? "Department Selection" : "Current Collection") : "End of Library"}
                    </h3>
                    <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">
                        {products.length} Items Available
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="py-40 text-center">
                        <h3 className="text-[12px] uppercase tracking-[0.4em] font-black text-black">Empty Library</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-16 md:gap-x-10 md:gap-y-24">
                        {products.map((product: Product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.name}
                                slug={product.slug}
                                price={Number(product.price)}
                                image={product.images?.[0] || "/window.svg"}
                                discountPercent={Number(product.discountPercent)}
                                sizes={product.sizes}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Features Banner */}
            {!hideHero && !categorySlug && !subcategorySlug && (
                <div className="bg-black text-white py-32 overflow-hidden relative border-y border-white/5">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                        <span className="text-[40vw] font-black uppercase tracking-tighter leading-none italic">MIGRA</span>
                    </div>

                    <div className="mx-auto max-w-[1800px] px-6 relative z-10 text-center">
                        <h3 className="text-4xl md:text-[5vw] font-black uppercase tracking-tighter mb-24 max-w-5xl mx-auto leading-[0.85]">
                            Technical Integrity <br /><span className="text-white/30 italic">Crafted Beyond Seasonal Limits</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-4 lg:gap-16">
                            {[
                                { title: "Organic Materials", desc: "Highest grade natural fibers sourced from ethical farms." },
                                { title: "Hand-Finished", desc: "Every piece undergoes precise manual quality control." },
                                { title: "Limited Supply", desc: "Small batch production to ensure exclusivity and reduce waste." }
                            ].map((feature, i) => (
                                <div key={i} className="space-y-4 border-l border-white/10 pl-8 text-left hover:border-white transition-colors duration-500">
                                    <h4 className="text-[11px] uppercase tracking-[0.4em] font-black">{feature.title}</h4>
                                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] leading-loose">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Popular Products Section (Fixed Visibility) */}
            {!hideHero && !categorySlug && !subcategorySlug && popularProducts.length > 0 && (
                <div className="py-16 border-t border-black/5">
                    <div className="mx-auto max-w-[1800px] px-6">
                        <div className="flex items-center justify-between mb-10">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/60">Selection</span>
                                <h3 className="text-4xl font-black uppercase tracking-tighter text-black">Most Wanted</h3>
                            </div>
                            <Link href="/shop" className="text-[11px] uppercase tracking-[0.3em] font-black border-b-2 border-black pb-1 hover:text-black/50 transition-colors text-black">
                                View Entire Archive
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                            {popularProducts.map((product: Product) => (
                                <ProductCard
                                    key={`popular-${product.id}`}
                                    id={product.id}
                                    title={product.name}
                                    slug={product.slug}
                                    price={Number(product.price)}
                                    image={product.images?.[0] || "/window.svg"}
                                    discountPercent={Number(product.discountPercent)}
                                    sizes={product.sizes}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Redesigned Footer */}
            <Footer />
        </main>
    );
}
