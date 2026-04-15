"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/lib/stores/cart.store";
import { useWishlistStore } from "@/lib/stores/wishlist.store";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type ProductCardProps = {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  image: string | StaticImageData;
  hoverImage?: string | StaticImageData;
  allImages?: string[];
  discountAmount?: number;
  currency?: string;
  className?: string;
  sizes?: string[];
  label?: 'BESTSELLER' | 'NEW' | 'SALE' | null;
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
  hoverImage,
  allImages = [],
  discountAmount = 0,
  currency = "USD",
  className = "",
  sizes = [],
  label,
}: ProductCardProps) {
  const { t } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const router = useRouter();

  // Combine images for mobile carousel
  const carouselImages = allImages.length > 0
    ? allImages
    : [image, hoverImage].filter(Boolean) as (string | StaticImageData)[];

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(id));

  const hasDiscount = discountAmount > 0;
  const originalPrice = price;
  const finalPrice = Math.max(0, price - discountAmount);
  // Calculate percentage dynamically for display
  const discountPercent = hasDiscount ? Math.round((discountAmount / price) * 100) : 0;

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
      price: finalPrice,
      image: typeof carouselImages[0] === "string" ? carouselImages[0] : undefined,
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
        price: finalPrice,
        image: typeof carouselImages[0] === "string" ? (carouselImages[0] as string) : undefined,
        hoverImage: typeof carouselImages[1] === "string" ? (carouselImages[1] as string) : undefined,
        allImages: carouselImages.every(img => typeof img === 'string') ? carouselImages as string[] : undefined,
        slug: slug ?? "",
        sizes,
      });
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const cardContent = (
    <>
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#f9f9f9] overflow-hidden p-8">

        {/* Desktop View: Smooth Hover */}
        <div className="hidden md:block absolute inset-0 p-8">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
            className={`object-contain transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] p-4 ${hoverImage ? "group-hover:opacity-0 group-hover:scale-105 group-hover:-translate-x-3 group-hover:blur-sm" : "group-hover:opacity-90"}`}
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${title} - alternative view`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
              className="object-contain opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] scale-110 group-hover:scale-100 translate-x-3 group-hover:translate-x-0 p-4"
            />
          )}
        </div>

        {/* Mobile View: Carousel with Arrows */}
        <div className="md:hidden absolute inset-0 p-8">
          {carouselImages.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`${title} - view ${idx + 1}`}
              fill
              sizes="100vw"
              className={`object-contain transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] p-4 ${idx === currentImgIdx ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[15%]"}`}
            />
          ))}

          {/* Arrows for Mobile */}
          {carouselImages.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-0 z-20">
              <button onClick={prevImage} className="w-7 h-7 flex items-center justify-center bg-white/25 backdrop-blur-[1px] text-black/45 active:text-black transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button onClick={nextImage} className="w-7 h-7 flex items-center justify-center bg-white/25 backdrop-blur-[1px] text-black/45 active:text-black transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>

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

        {label && (
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
            <span className={`text-[8px] md:text-[10px] uppercase font-black tracking-[0.2em] px-2 py-1 md:px-2.5 md:py-1.5 shadow-2xl backdrop-blur-md ${label === 'BESTSELLER' ? 'bg-black text-white' :
              label === 'NEW' ? 'bg-white text-black border border-black/20' :
                'bg-zinc-100 text-black border border-black/5'
              }`}>
              {label === 'BESTSELLER' ? t('common.hit') : label === 'NEW' ? t('common.new_arrival') : t('common.sale')}
            </span>
          </div>
        )}

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
              {formatPrice(finalPrice, currency)}
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
        className="mt-4 w-full py-3 bg-black text-white text-[10px] uppercase font-bold tracking-[0.2em] lg:opacity-0 lg:group-hover:opacity-100 hover:bg-zinc-800 hover:tracking-[0.25em] active:scale-[0.98] transition-all duration-300 z-10 relative"
      >
        {isAdded ? t('common.added') : (sizes.length > 0 && !selectedSize ? (showSizeError ? t('common.choose_size') : t('common.select_size')) : t('common.add_to_bag'))}
      </button>
    </article>
  );
}


