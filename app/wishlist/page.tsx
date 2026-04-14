"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/lib/stores/wishlist.store";
import { useCartStore } from "@/lib/stores/cart.store";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface WishlistItemProps {
    item: any;
    onRemove: (id: string) => void;
}

function WishlistItem({ item, onRemove }: WishlistItemProps) {
    const addToCart = useCartStore((state) => state.addToCart);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [showSizeError, setShowSizeError] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const router = useRouter();

    const handleAddToCart = () => {
        if (item.sizes && item.sizes.length > 0 && !selectedSize) {
            setShowSizeError(true);
            setTimeout(() => setShowSizeError(false), 2000);
            return;
        }

        addToCart({
            id: selectedSize ? `${item.id}-${selectedSize}` : item.id,
            baseId: item.id,
            size: selectedSize || undefined,
            title: selectedSize ? `${item.title} / ${selectedSize}` : item.title,
            price: item.price,
            image: item.image
        });

        setIsAdded(true);
        setSelectedSize(null);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="group space-y-4">
            <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden">
                <Link href={`/product/${item.slug}`}>
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-widest text-black/20 font-bold">No Image</div>
                    )}
                </Link>
                {/* Remove button */}
                <button
                    onClick={() => onRemove(item.id)}
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    aria-label="Remove from wishlist"
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="space-y-3">
                <div className="space-y-1">
                    <Link href={`/product/${item.slug}`} className="hover:text-black/50 transition-colors">
                        <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-black leading-tight truncate">{item.title}</h2>
                    </Link>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] tracking-widest font-bold text-black/40">€{item.price.toFixed(2)}</p>

                        {/* Size Picker on Hover */}
                        {item.sizes && item.sizes.length > 0 && (
                            <div className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ${showSizeError ? "scale-110 opacity-100" : ""}`}>
                                {item.sizes.slice(0, 5).map((size: string) => (
                                    <button
                                        key={size}
                                        onClick={() => { setSelectedSize(selectedSize === size ? null : size); setShowSizeError(false); }}
                                        className={`min-w-[20px] h-5 flex items-center justify-center text-[8px] font-bold border transition-colors ${selectedSize === size
                                            ? "bg-black text-white border-black"
                                            : showSizeError
                                                ? "border-red-500 text-red-500 animate-pulse"
                                                : "bg-white text-black/40 border-black/10 hover:border-black hover:text-black"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleAddToCart}
                    className="w-full border border-black/10 py-2.5 text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all duration-300"
                >
                    {isAdded ? "Added ✓" : (item.sizes && item.sizes.length > 0 && !selectedSize ? (showSizeError ? "Choose Size" : "Select Size") : "Add to Cart")}
                </button>
            </div>
        </div>
    );
}

export default function WishlistPage() {
    const items = useWishlistStore((state) => state.items);
    const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
    const clearWishlist = useWishlistStore((state) => state.clearWishlist);

    return (
        <main className="flex-1 flex flex-col min-h-screen justify-between bg-white pt-6 border-t border-black/[0.03]">
            <div className="mx-auto w-full max-w-[1500px] px-6 mb-16">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-black/[0.1] pb-6 mb-12">
                    <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-black text-black/30">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-black">Wishlist</span>
                    </nav>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/20">MIGRA®</span>
                        <div className="w-12 h-[1px] bg-black/10 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-black" />
                            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-black">Saved Items</span>
                        </div>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-8 text-center">
                        <div className="text-[80px] leading-none opacity-5 font-black uppercase tracking-tighter select-none">Saved</div>
                        <div className="space-y-3">
                            <h1 className="text-2xl font-black uppercase tracking-tighter text-black">No Saved Items</h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/30">Items you save will appear here</p>
                        </div>
                        <Link
                            href="/"
                            className="mt-4 bg-black text-white px-8 py-3 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black/90 transition-colors"
                        >
                            Explore the Archive
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-10">
                            <h1 className="text-sm uppercase tracking-[0.4em] font-black text-black">
                                Saved Items <span className="text-black/30">({items.length})</span>
                            </h1>
                            <button
                                onClick={clearWishlist}
                                className="text-[9px] uppercase tracking-[0.3em] font-bold text-black/30 hover:text-black transition-colors border-b border-black/20 hover:border-black pb-0.5"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-16">
                            {items.map((item) => (
                                <WishlistItem
                                    key={item.id}
                                    item={item}
                                    onRemove={removeFromWishlist}
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

