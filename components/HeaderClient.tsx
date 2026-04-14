"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart.store";
import { useWishlistStore } from "@/lib/stores/wishlist.store";

type Subcategory = { id: string; name: string; slug: string };
type Category = { id: string; name: string; slug: string; subcategories: Subcategory[] };

export function HeaderClient({ categories }: { categories: Category[] }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const cartCount = useCartStore((state) => state.items.reduce((a, b) => a + b.quantity, 0));
    const wishlistCount = useWishlistStore((state) => state.items.length);

    if (pathname?.startsWith("/admin")) return null;

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-black/5 uppercase tracking-widest text-[11px] font-medium text-black">
            <div className="mx-auto max-w-[1800px] px-6">
                <div className="flex h-14 md:h-16 items-center justify-between">

                    {/* Left: Desktop Navigation */}
                    <nav className="hidden md:flex flex-1 items-center space-x-8">
                        {categories.slice(0, 4).map((category) => (
                            <div key={category.id} className="relative group h-full flex items-center">
                                <Link
                                    href={`/${category.slug}`}
                                    className="hover:text-black/50 transition-colors"
                                >
                                    {category.name}
                                </Link>

                                {category.subcategories.length > 0 && (
                                    <div className="absolute left-0 top-full pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        <div className="w-48 bg-white border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] py-4">
                                            {category.subcategories.map((sub) => (
                                                <Link
                                                    key={sub.id}
                                                    href={`/${category.slug}/${sub.slug}`}
                                                    className="block px-6 py-2 hover:bg-black/[0.02] transition-colors"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Center: Logo */}
                    <div className="flex-shrink-0 absolute left-1/2 -translate-x-1/2">
                        <Link href="/" className="text-lg font-bold tracking-[0.2em]">
                            MIGRA
                        </Link>
                    </div>

                    {/* Right: Actions & Mobile Toggle */}
                    <div className="flex items-center justify-end flex-1 space-x-2 md:space-x-4">
                        <Link href="/wishlist" className="relative hover:text-black/50 transition-colors p-2" aria-label="Wishlist">
                            <svg className="w-5 h-5 md:w-[18px] md:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.2" d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
                            </svg>
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 text-[7px] font-bold text-black/60 uppercase tracking-tighter">{wishlistCount}</span>
                            )}
                        </Link>

                        <Link href="/cart" className="relative mr-0 hover:text-black/50 transition-colors p-2" aria-label="Cart">
                            <svg className="w-5 h-5 md:w-[18px] md:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 text-[8px] bg-black text-white w-3.5 h-3.5 flex items-center justify-center rounded-none font-bold leading-none">{cartCount}</span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2"
                        >
                            <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M4 8h16M4 16h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-black/5 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-6 py-8 space-y-8">
                    {categories.map((category) => (
                        <div key={category.id} className="space-y-4">
                            <Link
                                href={`/${category.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block font-bold text-sm tracking-widest border-b border-black/5 pb-2"
                            >
                                {category.name}
                            </Link>
                            <div className="pl-2 space-y-3">
                                {category.subcategories.map((sub) => (
                                    <Link
                                        key={sub.id}
                                        href={`/${category.slug}/${sub.slug}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-black/60 hover:text-black transition-colors"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
}
