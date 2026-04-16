
import { GridSkeleton } from "@/components/ProductSkeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Skeleton Placeholder */}
            <div className="h-[200px] w-full bg-zinc-50 border-b border-black/[0.03] animate-pulse" />

            {/* Filters Skeleton Placeholder */}
            <div className="h-14 border-b border-black/5 bg-white mb-10" />

            <GridSkeleton count={15} />
        </div>
    );
}
