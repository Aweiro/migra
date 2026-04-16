
export function ProductSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="aspect-[3/4] bg-zinc-100 w-full" />
            <div className="space-y-2">
                <div className="h-3 bg-zinc-100 w-3/4" />
                <div className="h-3 bg-zinc-100 w-1/4" />
            </div>
            <div className="h-10 bg-zinc-900/5 w-full mt-4" />
        </div>
    );
}

export function GridSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div className="mx-auto max-w-[1800px] px-6 pb-10">
            <div className="h-10 border-b border-black/5 mb-8 flex justify-between items-end pb-4">
                <div className="h-3 bg-zinc-100 w-32" />
                <div className="h-3 bg-zinc-100 w-24" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-16 md:gap-x-10 md:gap-y-10">
                {Array.from({ length: count }).map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
