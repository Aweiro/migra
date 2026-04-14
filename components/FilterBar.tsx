"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";

interface FilterBarProps {
    allSizes: string[];
    allBrands: string[];
}

const SORT_OPTIONS = [
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
];

export function FilterBar({ allSizes, allBrands }: FilterBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [openMenu, setOpenMenu] = useState<"size" | "brand" | "sort" | null>(null);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Refs for click-outside detection
    const desktopSortRef = useRef<HTMLDivElement>(null);
    const desktopSizeRef = useRef<HTMLDivElement>(null);
    const desktopBrandRef = useRef<HTMLDivElement>(null);
    const mobileSortRef = useRef<HTMLDivElement>(null);

    // Prevent body scroll when mobile filters are open
    useEffect(() => {
        if (isMobileFiltersOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isMobileFiltersOpen]);

    const activeSort = searchParams.get("sort") || "newest";
    const activeSizes = searchParams.get("size")?.split(",") || [];
    const activeBrands = searchParams.get("brand")?.split(",") || [];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            const isInside =
                desktopSizeRef.current?.contains(target) ||
                desktopBrandRef.current?.contains(target) ||
                desktopSortRef.current?.contains(target) ||
                mobileSortRef.current?.contains(target);

            if (!isInside) {
                setOpenMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(params)) {
                if (value === null) newSearchParams.delete(key);
                else newSearchParams.set(key, value);
            }
            return newSearchParams.toString();
        },
        [searchParams]
    );

    const handleSort = (sort: string) => {
        router.push(pathname + "?" + createQueryString({ sort }), { scroll: false });
        setOpenMenu(null);
    };

    const toggleFilter = (type: "size" | "brand", value: string) => {
        const currentValues = searchParams.get(type)?.split(",") || [];
        let nextValues: string[];
        if (currentValues.includes(value)) {
            nextValues = currentValues.filter((v) => v !== value);
        } else {
            nextValues = [...currentValues, value];
        }
        router.push(pathname + "?" + createQueryString({
            [type]: nextValues.length > 0 ? nextValues.join(",") : null
        }), { scroll: false });
    };

    const selectedSortLabel = SORT_OPTIONS.find(o => o.value === activeSort)?.label || "Sort By";

    return (
        <div className="w-full my-4 md:my-6 relative md:z-30">
            <div className="mx-auto max-w-[1800px] px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 py-4 border-y border-black/5">

                    {/* Desktop Version: Minimalist Scalable Dropdowns */}
                    <div className="hidden md:flex flex-1 items-center gap-12">
                        {/* Filter Status */}
                        <div className="flex items-center gap-3 pr-8 border-r border-black/10 flex-shrink-0">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-black">Filter_Set</span>
                            {(activeSizes.length > 0 || activeBrands.length > 0) && (
                                <span className="flex items-center justify-center min-w-[18px] h-4.5 bg-black text-white text-[8px] font-mono font-bold px-1">
                                    {activeSizes.length + activeBrands.length}
                                </span>
                            )}
                        </div>

                        {/* Size Dropdown */}
                        {allSizes.length > 0 && (
                            <div className="relative" ref={desktopSizeRef}>
                                <button
                                    onClick={() => setOpenMenu(openMenu === "size" ? null : "size")}
                                    className={`flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] font-black transition-all ${activeSizes.length > 0 ? "text-black" : "text-black/30 hover:text-black"}`}
                                >
                                    <span>Sizes</span>
                                    {activeSizes.length > 0 && <span className="text-[8px] font-mono">({activeSizes.length})</span>}
                                    <svg className={`transition-transform duration-500 ${openMenu === "size" ? "rotate-180" : ""}`} width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </button>

                                <div className={`absolute left-0 mt-4 w-72 bg-white border border-black shadow-[25px_25px_0px_rgba(0,0,0,0.05)] z-50 p-6 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${openMenu === "size" ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-4 scale-95 pointer-events-none"}`}>
                                    <div className="grid grid-cols-4 gap-2">
                                        {allSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => toggleFilter("size", size)}
                                                className={`h-9 flex items-center justify-center text-[10px] font-bold border transition-all ${activeSizes.includes(size) ? "bg-black text-white border-black" : "bg-white text-black border-black/10 hover:border-black/30"}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Brand Dropdown */}
                        {allBrands.length > 0 && (
                            <div className="relative" ref={desktopBrandRef}>
                                <button
                                    onClick={() => setOpenMenu(openMenu === "brand" ? null : "brand")}
                                    className={`flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] font-black transition-all ${activeBrands.length > 0 ? "text-black" : "text-black/30 hover:text-black"}`}
                                >
                                    <span>Brands</span>
                                    {activeBrands.length > 0 && <span className="text-[8px] font-mono">({activeBrands.length})</span>}
                                    <svg className={`transition-transform duration-500 ${openMenu === "brand" ? "rotate-180" : ""}`} width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </button>

                                <div className={`absolute left-0 mt-4 w-64 bg-white border border-black shadow-[25px_25px_0px_rgba(0,0,0,0.05)] z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] max-h-[400px] overflow-y-auto no-scrollbar ${openMenu === "brand" ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-4 scale-95 pointer-events-none"}`}>
                                    <div className="flex flex-col p-2">
                                        {allBrands.map((brand) => (
                                            <button
                                                key={brand}
                                                onClick={() => toggleFilter("brand", brand)}
                                                className={`w-full text-left px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-black transition-all flex items-center justify-between ${activeBrands.includes(brand) ? "bg-black text-white" : "text-black/40 hover:text-black hover:bg-zinc-50"}`}
                                            >
                                                <span>{brand}</span>
                                                {activeBrands.includes(brand) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile: Compact Architectural Filter Block */}
                    <div className="md:hidden flex items-center justify-between gap-2 h-11">
                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="flex-1 h-full flex items-center justify-between border border-black px-4 text-[9px] uppercase tracking-[0.3em] font-black text-black active:bg-zinc-100 transition-all font-mono"
                        >
                            <div className="flex items-center gap-2">
                                <span className="tracking-[0.5em]">FILTER</span>
                                {(activeSizes.length > 0 || activeBrands.length > 0) && (
                                    <span className="w-4 h-4 bg-black text-white flex items-center justify-center font-mono text-[7px]">
                                        {activeSizes.length + activeBrands.length}
                                    </span>
                                )}
                            </div>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="relative h-full" ref={mobileSortRef}>
                            <button
                                onClick={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
                                className={`h-full w-11 border border-black flex items-center justify-center transition-all ${openMenu === "sort" ? "bg-black text-white" : "bg-white text-black active:bg-zinc-100"}`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M4 7h16M7 12h10M10 17h4" />
                                </svg>
                            </button>

                            <div className={`absolute right-0 top-full mt-2 w-52 bg-white border border-black z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${openMenu === "sort" ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}`}>
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSort(option.value)}
                                        className={`w-full text-left px-5 py-4 text-[9px] uppercase tracking-[0.3em] font-black border-b border-black last:border-0 ${activeSort === option.value ? "bg-black text-white" : "hover:bg-zinc-50"}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Right Side: Sort & Reset */}
                    <div className="hidden md:flex items-center gap-10">
                        <div className="relative" ref={desktopSortRef}>
                            <button
                                onClick={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
                                className="flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] font-black text-black group hover:opacity-60 transition-opacity"
                            >
                                <span className="text-black/20 tracking-[0.2em]">Sort_By:</span>
                                <span>{selectedSortLabel}</span>
                                <svg className={`transition-transform duration-300 ${openMenu === "sort" ? "rotate-180" : ""}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>

                            <div className={`absolute right-0 mt-4 w-56 bg-white border border-black shadow-[25px_25px_0px_rgba(0,0,0,0.05)] z-50 py-1.5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${openMenu === "sort" ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-4 scale-95 pointer-events-none"}`}>
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSort(option.value)}
                                        className={`w-full text-left px-6 py-3.5 text-[9px] uppercase tracking-[0.3em] font-black transition-colors ${activeSort === option.value ? "bg-black text-white" : "hover:bg-zinc-50 text-black/40 hover:text-black"}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(activeSizes.length > 0 || activeBrands.length > 0 || activeSort !== "newest") && (
                            <button onClick={() => router.push(pathname)} className="h-8 px-4 flex items-center justify-center bg-black text-white text-[8px] uppercase tracking-[0.3em] font-black hover:bg-black/80 transition-all">
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer - Extreme Z-Index & Persistent for Two-Way Animation */}
            <div className={`fixed inset-0 z-[10000] md:hidden ${isMobileFiltersOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div
                    className={`absolute inset-0 bg-black/40 transition-all duration-1000 ease-in-out ${isMobileFiltersOpen ? "opacity-100 backdrop-blur-md" : "opacity-0 backdrop-blur-none"}`}
                    onClick={() => setIsMobileFiltersOpen(false)}
                    style={{ transitionProperty: "opacity, backdrop-filter, -webkit-backdrop-filter" }}
                />
                <div className={`absolute right-0 top-0 h-full w-[85%] bg-white flex flex-col border-l border-black shadow-[-20px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileFiltersOpen ? "translate-x-0" : "translate-x-full"}`}>
                    {/* Header with Exit */}
                    <div className="p-6 border-b border-black flex items-center justify-between bg-white sticky top-0 z-10">
                        <h2 className="text-[12px] uppercase tracking-[0.5em] font-black">Archive Filters</h2>
                        <button onClick={() => setIsMobileFiltersOpen(false)} className="w-10 h-10 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-12 pb-32">
                        {/* Sizes */}
                        {allSizes.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[9px] uppercase tracking-[0.4em] font-black text-black">Sizes_Index</h3>
                                    <span className="text-[7px] font-mono text-black/20">{allSizes.length} units</span>
                                </div>
                                <div className="grid grid-cols-6 gap-1.5">
                                    {allSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => toggleFilter("size", size)}
                                            className={`h-9 flex items-center justify-center text-[10px] font-bold border transition-all ${activeSizes.includes(size) ? "bg-black text-white border-black" : "bg-white text-black border-black/10"}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Brands */}
                        {allBrands.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-black">Brands</h3>
                                    <span className="text-[8px] font-mono text-black/20">{allBrands.length} manufacturers</span>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    {allBrands.map((brand) => (
                                        <button
                                            key={brand}
                                            onClick={() => toggleFilter("brand", brand)}
                                            className={`h-12 flex items-center justify-between px-4 border border-black/10 transition-all ${activeBrands.includes(brand) ? "bg-black text-white border-black" : "bg-white text-black hover:border-black/30"}`}
                                        >
                                            <span className="text-[12px] uppercase tracking-[0.2em] font-black">{brand}</span>
                                            {activeBrands.includes(brand) && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sticky Bottom Actions */}
                    <div className="absolute bottom-0 left-0 w-full p-6 border-t border-black bg-white flex flex-col gap-3">
                        {(activeSizes.length > 0 || activeBrands.length > 0) && (
                            <button onClick={() => {
                                router.push(pathname);
                                setIsMobileFiltersOpen(false);
                            }} className="text-[9px] uppercase tracking-[0.3em] font-bold text-black border-b border-black w-max mx-auto pb-1 mb-2">
                                Reset Filters
                            </button>
                        )}
                        <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full h-14 bg-black text-white text-[11px] uppercase tracking-[0.5em] font-black hover:bg-zinc-800 transition-colors shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
