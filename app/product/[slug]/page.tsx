import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const product = await prisma.product.findUnique({
        where: { slug: resolvedParams.slug }
    });

    if (!product) return { title: "Product Not Found | MIGRA" };

    return { title: `${product.name} | MIGRA Contextual` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    const rawProduct = await prisma.product.findUnique({
        where: { slug: resolvedParams.slug },
        include: {
            subcategory: {
                include: {
                    category: true
                }
            }
        }
    });

    if (!rawProduct) {
        notFound();
    }

    // Cast once to carry sizes + isCustomOrder (fields exist at runtime via schema)
    const product = rawProduct as typeof rawProduct & { sizes: string[]; isCustomOrder: boolean };

    const price = Number(product.price);
    const discountPercent = Number(product.discountPercent);
    const hasDiscount = discountPercent > 0;
    const discountedPrice = hasDiscount ? price * (1 - discountPercent / 100) : price;

    // Fetch related products (same subcategory)
    const relatedProducts = await prisma.product.findMany({
        where: {
            subcategoryId: product.subcategoryId,
            id: { not: product.id }
        },
        take: 4,
        orderBy: { createdAt: "desc" }
    });

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: product.subcategory.category.name, href: `/${product.subcategory.category.slug}` },
        { label: product.subcategory.name, href: `/${product.subcategory.category.slug}/${product.subcategory.slug}` },
        { label: product.name, href: `/product/${product.slug}` }
    ];

    return (
        <main className="flex-1 flex flex-col min-h-screen justify-between bg-white pt-6 border-t border-black/[0.03]">
            <div className="mx-auto w-full max-w-[1500px] px-6 mb-16">

                {/* Refined Minimal Header */}
                {/* Refined Responsive Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.1] pb-6 mb-8 gap-6">
                    <nav className="flex flex-wrap items-center gap-y-2 gap-x-3 text-[9px] uppercase tracking-[0.3em] font-black">
                        {breadcrumbs.map((crumb, i) => (
                            <div key={crumb.href} className="flex items-center gap-2">
                                <Link
                                    href={crumb.href}
                                    className={`${i === breadcrumbs.length - 1 ? "text-black" : "text-black/30 hover:text-black"} transition-colors whitespace-nowrap`}
                                >
                                    {crumb.label}
                                </Link>
                                {i < breadcrumbs.length - 1 && <span className="text-black/10">/</span>}
                            </div>
                        ))}
                    </nav>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-4 w-full sm:w-auto border-t sm:border-t-0 border-black/[0.05] pt-4 sm:pt-0">
                        <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/20">MIGRA®</span>
                        <div className="w-12 h-[1px] bg-black/10 hidden xl:block" />
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-black animate-pulse" />
                            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-black whitespace-nowrap">Archival Item</span>
                        </div>
                    </div>
                </div>

                {/* Top Section: Gallery and Form Actions */}
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-18">
                    {/* Left: Gallery */}
                    <div className="w-full lg:w-[55%] xl:w-[60%]">
                        <ProductGallery images={product.images} />
                    </div>

                    {/* Right: Info (Sticky Form) */}
                    <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-start">
                        <div className="sticky top-28 space-y-10">

                            {/* Title & Price */}
                            <div className="space-y-4 text-black">
                                <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-black">
                                    {product.name}
                                </h1>

                                <div className="flex items-baseline gap-4 text-black">
                                    <span className="text-2xl font-bold tracking-widest text-black">
                                        €{discountedPrice.toFixed(2)}
                                    </span>
                                    {hasDiscount && (
                                        <>
                                            <span className="text-sm text-black/30 line-through tracking-widest">
                                                €{price.toFixed(2)}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-red-500">
                                                {discountPercent}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Client Actions: Size, Availability, Add to Cart */}
                            <ProductActions
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    image: product.images?.[0],
                                    slug: product.slug,
                                    stock: product.stock,
                                    isCustomOrder: product.isCustomOrder,
                                }}
                                sizes={product.sizes}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Details, Specs, Shipping (Full width or contained grid below) */}
                <div className="mt-16 pt-12 border-t border-black/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
                        <div className="space-y-6">
                            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black border-b border-black pb-4 inline-block text-black">Description</h3>
                            <div className="text-xs font-light leading-loose text-black/70 whitespace-pre-wrap">
                                {product.description || "Minimalist by design. Engineered for maximum context. This piece integrates seamlessly into the contemporary wardrobe, balancing structured aesthetics with fluid functionality."}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black border-b border-black pb-4 inline-block text-black">Specifications</h3>
                            <ul className="space-y-3 text-[11px] uppercase tracking-[0.2em] text-black/60 list-disc list-inside bg-[#f9f9f9] p-6">
                                <li>High-density construction</li>
                                <li>Manufactured ethically in Europe</li>
                                <li>Contextual fit (True to size)</li>
                                <li>Product Ref: {product.id.slice(-8).toUpperCase()}</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black border-b border-black pb-4 inline-block text-black">Shipping & Returns</h3>
                            <div className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-black/50 leading-loose">
                                <p>Complimentary express shipping on all orders over €200.</p>
                                <p>14-day archival return policy. Items must be unworn with all tags attached.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 border-t border-black/5 pt-12">
                        <div className="flex items-center justify-between mb-16">
                            <h3 className="text-xl md:text-3xl font-black text-black uppercase tracking-tighter">Related Context</h3>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                            {relatedProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    id={p.id}
                                    title={p.name}
                                    slug={p.slug}
                                    price={Number(p.price)}
                                    image={p.images?.[0] || "/window.svg"}
                                    discountPercent={Number(p.discountPercent)}
                                    sizes={p.sizes}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
