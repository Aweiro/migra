"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart.store";
import { useWishlistStore } from "@/lib/stores/wishlist.store";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Subcategory = {
    id: string;
    name: string;
    name_uk?: string | null;
    name_ru?: string | null;
    name_pl?: string | null;
    slug: string
};
type Category = {
    id: string;
    name: string;
    name_uk?: string | null;
    name_ru?: string | null;
    name_pl?: string | null;
    slug: string;
    subcategories: Subcategory[]
};

export function HeaderClient({ categories }: { categories: Category[] }) {
    const { language, setLanguage, t, getLocalized } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const cartCount = useCartStore((state) => state.items.reduce((a, b) => a + b.quantity, 0));
    const wishlistCount = useWishlistStore((state) => state.items.length);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (pathname?.startsWith("/admin")) return null;

    // Use effective counts after hydration to avoid flashes and mismatches
    const effectiveCartCount = mounted ? cartCount : 0;
    const effectiveWishlistCount = mounted ? wishlistCount : 0;

    return (
        <>
            {/* Mobile Menu Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[9999] transition-all duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <header className="sticky top-0 z-[10000] w-full bg-white border-b border-black/5 uppercase tracking-widest text-[11px] font-medium text-black">
                <div className="mx-auto max-w-[1800px] px-6">
                    <div className="flex h-14 md:h-16 items-center justify-between relative">
                        {/* Menu Toggle (Mobile) / Nav (Desktop) */}
                        <div className="flex-1 flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 -ml-2 hover:bg-black/5 transition-colors rounded-full"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.2" d="M4 8h16M4 16h16" />
                                    )}
                                </svg>
                            </button>

                            <nav className="hidden md:flex items-center space-x-8">
                                {categories.slice(0, 4).map((category) => (
                                    <div key={category.id} className="relative group h-full flex items-center">
                                        <Link
                                            href={`/${category.slug}`}
                                            className="hover:text-black/50 transition-colors"
                                        >
                                            {getLocalized(category)}
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
                                                            {getLocalized(sub)}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Center: Logo */}
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xl md:text-2xl font-bold tracking-[0.2em]"
                            >
                                MIGRA
                            </Link>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex-1 flex items-center justify-end space-x-1 md:space-x-4">
                            {/* Language Switcher - Desktop */}
                            {/* Language Switcher - Desktop (Compact Dropdown) */}
                            <div className="hidden md:block relative group mr-4">
                                <button className="flex items-center gap-1.5 text-[10px] font-black tracking-[0.2em] text-black">
                                    <span className="uppercase">{language}</span>
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-20 group-hover:rotate-180 transition-transform duration-300">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </button>

                                {/* Flyout Menu */}
                                <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[10001]">
                                    <div className="bg-white border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] py-1 min-w-[100px]">
                                        {[
                                            { id: 'en', label: 'EN' },
                                            { id: 'uk', label: 'UA' },
                                            { id: 'ru', label: 'RU' },
                                            { id: 'pl', label: 'PL' }
                                        ].map((lang) => (
                                            <button
                                                key={lang.id}
                                                onClick={() => setLanguage(lang.id as any)}
                                                className={`w-full text-left px-4 py-2 text-[9px] uppercase tracking-widest transition-colors hover:bg-black/[0.02] ${language === lang.id ? "font-black text-black" : "text-black/40 font-medium"}`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Link href="/wishlist" className="relative hover:bg-black/5 p-2 transition-colors rounded-full" aria-label="Wishlist">
                                <svg className="w-5 h-5 md:w-[18px] md:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.2" d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
                                </svg>
                                {effectiveWishlistCount > 0 && (
                                    <span className="absolute top-1 right-1 text-[7px] font-bold text-black/60 uppercase tracking-tighter">{effectiveWishlistCount}</span>
                                )}
                            </Link>

                            <Link href="/cart" className="relative hover:bg-black/5 p-2 transition-colors rounded-full" aria-label="Cart">
                                <svg className="w-5 h-5 md:w-[18px] md:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {effectiveCartCount > 0 && (
                                    <span className="absolute top-1 right-1 text-[8px] bg-black text-white w-3.5 h-3.5 flex items-center justify-center font-bold">{effectiveCartCount}</span>
                                )}
                            </Link>
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
                                    {getLocalized(category)}
                                </Link>
                                <div className="pl-2 space-y-3">
                                    {category.subcategories.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            href={`/${category.slug}/${sub.slug}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-black/60 hover:text-black transition-colors"
                                        >
                                            {getLocalized(sub)}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Language Switcher - Mobile */}
                        <div className="pt-8 border-t border-black/5 space-y-4">
                            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/20 block">
                                {t('common.language')}
                            </span>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { id: 'en', label: 'EN' },
                                    { id: 'uk', label: 'UA' },
                                    { id: 'ru', label: 'RU' },
                                    { id: 'pl', label: 'PL' }
                                ].map((lang) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => {
                                            setLanguage(lang.id as any);
                                            // Optional: close menu after selection
                                            // setIsMobileMenuOpen(false);
                                        }}
                                        className={`py-3 text-[10px] font-black tracking-widest transition-all border ${language === lang.id
                                            ? "bg-black text-white border-black"
                                            : "bg-black/[0.02] text-black/40 border-transparent hover:border-black/10"
                                            }`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
