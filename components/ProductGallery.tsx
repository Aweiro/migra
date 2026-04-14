"use client";

import Image from "next/image";
import { useState, useRef, MouseEvent } from "react";

export function ProductGallery({ images }: { images: string[] }) {
    const defaultImages = images && images.length > 0 ? images : ["/window.svg"];
    const [activeIndex, setActiveIndex] = useState(0);

    // Zoom State
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

    // Thumbnail Ref for scrolling
    const thumbContainerRef = useRef<HTMLDivElement>(null);

    const handlePrev = () => {
        setIsZoomed(false);
        setActiveIndex((prev) => (prev === 0 ? defaultImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIsZoomed(false);
        setActiveIndex((prev) => (prev === defaultImages.length - 1 ? 0 : prev + 1));
    };

    const scrollThumbnails = (direction: 'up' | 'down') => {
        if (thumbContainerRef.current) {
            const amount = 100;
            thumbContainerRef.current.scrollBy({
                top: direction === 'down' ? amount : -amount,
                behavior: 'smooth'
            });
        }
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) setIsZoomed(true);
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    return (
        <div className="flex flex-col-reverse md:flex-row gap-6 w-full">
            {/* Thumbnails */}
            {defaultImages.length > 1 && (
                <div className="relative flex flex-col items-center">
                    <div
                        ref={thumbContainerRef}
                        className="flex items-center md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 md:max-h-[60vh] shrink-0 px-1 md:px-0 pb-2 md:pb-0"
                    >
                        {defaultImages.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setIsZoomed(false);
                                    setActiveIndex(i);
                                }}
                                className={`relative w-18 h-24 shrink-0 transition-all duration-300 ${activeIndex === i ? "border-2 border-black opacity-100" : "border-2 border-transparent opacity-60 hover:opacity-100"}`}
                            >
                                <Image
                                    src={src}
                                    alt={`Thumbnail ${i + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Scroll Arrows (Only show if > 5) */}
                    {defaultImages.length > 5 && (
                        <div className="hidden md:flex items-center gap-2 mt-4 text-black/30">
                            <button
                                onClick={() => scrollThumbnails('up')}
                                className="hover:text-black transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scrollThumbnails('down')}
                                className="hover:text-black transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Main Image */}
            <div className="relative aspect-square w-full bg-[#f9f9f9] overflow-hidden group">

                <div
                    className="absolute inset-0 cursor-crosshair z-10"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                >
                    <Image
                        src={defaultImages[activeIndex]}
                        alt="Product preview"
                        fill
                        priority
                        className={`object-contain p-4 lg:p-6 transition-transform duration-500 ${isZoomed ? "opacity-0" : "opacity-100"}`}
                    />

                    {/* Zoom Overlay */}
                    {isZoomed && (
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `url(${defaultImages[activeIndex]})`,
                                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                backgroundSize: "200%",
                                backgroundRepeat: "no-repeat"
                            }}
                        />
                    )}
                </div>

                {/* Navigation Arrows */}
                {defaultImages.length > 1 && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                        <button
                            onClick={() => handlePrev()}
                            className="w-10 h-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-black/50 hover:text-black transition-colors rounded-full pointer-events-auto"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleNext()}
                            className="w-10 h-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-black/50 hover:text-black transition-colors rounded-full pointer-events-auto"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
