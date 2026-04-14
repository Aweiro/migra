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
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    const activeSort = searchParams.get("sort") || "newest";
    const activeSizes = searchParams.get("size")?.split(",") || [];
    const activeBrands = searchParams.get("brand")?.split(",") || [];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
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
        setIsSortOpen(false);
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
        <div className="w-full my-8 relative z-30">
            <div className="mx-auto max-w-[1800px] px-6">
                <div className="bg-white border border-black px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-8">

                    {/* Filter Groups */}
                    <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
                        <div className="flex items-center gap-3 pr-8 border-r border-black/10">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-black">Filter</span>
                                {(activeSizes.length > 0 || activeBrands.length > 0) && (
                                    <span className="flex items-center justify-center min-w-[20px] h-5 bg-black text-white text-[9px] font-mono font-bold px-1.5">
                                        {activeSizes.length + activeBrands.length}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Sizes */}
                        {allSizes.length > 0 && (
                            <div className="flex items-center gap-6">
                                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-black/20">Size /</span>
                                <div className="flex gap-1.5">
                                    {allSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => toggleFilter("size", size)}
                                            className={`h-7 px-3 flex items-center justify-center text-[9px] font-black transition-all border ${activeSizes.includes(size)
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-black/40 border-black/10 hover:border-black/30"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Brands */}
                        {allBrands.length > 0 && (
                            <div className="flex items-center gap-6">
                                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-black/20">Brand /</span>
                                <div className="flex gap-6">
                                    {allBrands.map((brand) => (
                                        <button
                                            key={brand}
                                            onClick={() => toggleFilter("brand", brand)}
                                            className={`text-[9px] uppercase tracking-[0.2em] font-black transition-all ${activeBrands.includes(brand)
                                                ? "text-black border-b-2 border-black pb-0.5"
                                                : "text-black/30 hover:text-black/60"
                                                }`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Sort & Reset */}
                    <div className="flex items-center gap-10">
                        {/* Custom Sort Dropdown */}
                        <div className="relative" ref={sortRef}>
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-5 text-[9px] uppercase tracking-[0.3em] font-black text-black group hover:opacity-60 transition-opacity"
                            >
                                <span className="text-black/20 tracking-[0.2em]">Sort_By:</span>
                                <span>{selectedSortLabel}</span>
                                <svg className={`transition-transform duration-500 ${isSortOpen ? "rotate-180" : ""}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>

                            {isSortOpen && (
                                <div className="absolute right-0 mt-4 w-56 bg-white border border-black shadow-[15px_15px_0px_rgba(0,0,0,0.05)] z-50 py-1.5 animate-in fade-in slide-in-from-top-3 duration-300">
                                    {SORT_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSort(option.value)}
                                            className={`w-full text-left px-6 py-3.5 text-[9px] uppercase tracking-[0.3em] font-black transition-colors ${activeSort === option.value
                                                ? "bg-black text-white"
                                                : "hover:bg-zinc-50 text-black/40 hover:text-black"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reset */}
                        {(activeSizes.length > 0 || activeBrands.length > 0 || activeSort !== "newest") && (
                            <button
                                onClick={() => router.push(pathname)}
                                className="h-8 px-4 flex items-center justify-center bg-black text-white text-[8px] uppercase tracking-[0.3em] font-black hover:bg-black/80 transition-all shadow-lg shadow-black/5"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
