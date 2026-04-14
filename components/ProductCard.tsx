"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/lib/stores/cart.store";
import { useWishlistStore } from "@/lib/stores/wishlist.store";

type ProductCardProps = {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  image: string | StaticImageData;
  discountPercent?: number;
  currency?: string;
  className?: string;
  sizes?: string[];
};

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);

export function ProductCard({
  id,
  title,
  slug,
  price,
  image,
  discountPercent = 0,
  currency = "USD",
  className = "",
  sizes = [],
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);
  const router = useRouter();

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(id));

  const hasDiscount = discountPercent > 0;
  const originalPrice = hasDiscount ? price / (1 - discountPercent / 100) : price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sizes.length > 0 && !selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 2000);
      return;
    }

    addToCart({
      id: selectedSize ? `${id}-${selectedSize}` : id,
      baseId: id,
      size: selectedSize || undefined,
      title: selectedSize ? `${title} / ${selectedSize}` : title,
      price,
      image: typeof image === "string" ? image : undefined,
    });

    setIsAdded(true);
    setSelectedSize(null);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        title,
        price,
        image: typeof image === "string" ? image : undefined,
        slug: slug ?? "",
        sizes,
      });
    }
  };

  const cardContent = (
    <>
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#f9f9f9] overflow-hidden p-8">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
          className="object-contain transition-opacity duration-500 group-hover:opacity-90 p-4"
        />

        {/* Wishlist Button — always visible */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center transition-all bg-white z-10"
          aria-label="Toggle wishlist"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 transition-colors duration-300 ${isWishlisted ? "fill-black stroke-black" : "fill-none stroke-black"}`}
          >
            <path
              d="M12 20.25c-4.5-4-7.5-6.85-7.5-10.25A4.22 4.22 0 0 1 8.75 5.75 4.7 4.7 0 0 1 12 7.06a4.7 4.7 0 0 1 3.25-1.31A4.22 4.22 0 0 1 19.5 10c0 3.4-3 6.25-7.5 10.25Z"
              strokeWidth="1"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        </button>

        {hasDiscount && (
          <span className="absolute bottom-4 left-4 bg-black text-white text-[10px] uppercase font-bold px-2 py-1 tracking-tighter">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col pt-4 space-y-1">
        <h3 className="text-[12px] uppercase tracking-wider font-medium text-black truncate">
          {title}
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-[12px] font-bold text-black">
              {formatPrice(price, currency)}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-black/30 line-through">
                {formatPrice(originalPrice, currency)}
              </span>
            )}
          </div>

          {/* Sizes: Below price on mobile, right-aligned on desktop */}
          {sizes.length > 0 && (
            <div className={`flex flex-wrap gap-1 transition-all duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-x-2 lg:group-hover:translate-x-0 ${showSizeError ? "scale-105" : ""}`}>
              {sizes.slice(0, 8).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(selectedSize === size ? null : size);
                    setShowSizeError(false);
                  }}
                  className={`min-w-[24px] h-6 flex items-center justify-center text-[9px] font-bold border transition-colors ${selectedSize === size
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
    </>
  );

  return (
    <article className={`group relative flex flex-col h-full bg-white ${className}`}>
      <div className="flex-1">
        {slug ? (
          <Link href={`/product/${slug}`} className="block w-full h-full">
            {cardContent}
          </Link>
        ) : (
          <div className="block w-full h-full">{cardContent}</div>
        )}
      </div>

      {/* Quick Add — Always at the bottom */}
      <button
        onClick={handleAddToCart}
        className="mt-6 w-full py-3 bg-black text-white text-[10px] uppercase font-bold tracking-[0.2em] lg:opacity-0 lg:group-hover:opacity-100 hover:bg-zinc-800 hover:tracking-[0.25em] active:scale-[0.98] transition-all duration-300 z-10 relative"
      >
        {isAdded ? "Added ✓" : (sizes.length > 0 && !selectedSize ? (showSizeError ? "Choose Size" : "Select Size") : "Add to Bag")}
      </button>
    </article>
  );
}


