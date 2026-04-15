"use client";

import { useState, useTransition } from "react";
import { toggleProductStatus } from "./actions";

interface ProductStatusToggleProps {
    productId: string;
    initialStatus: boolean;
}

export default function ProductStatusToggle({ productId, initialStatus }: ProductStatusToggleProps) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState(initialStatus);

    const handleToggle = async () => {
        const nextStatus = !status;
        setStatus(nextStatus); // Optimistic update

        startTransition(async () => {
            const result = await toggleProductStatus(productId, status);
            if (!result.success) {
                setStatus(status); // Revert on failure
                alert("Failed to update status: " + result.error);
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 border transition-all duration-300 w-full ${status
                ? "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400 font-black"
                : "bg-black/5 border-black/20 text-black/30 dark:border-white/20 dark:text-white/30"
                } ${isPending ? "opacity-50 cursor-waitScale" : "hover:scale-[1.02] active:scale-98"}`}
        >
            <div className={`w-1.5 h-1.5 rounded-full ${status ? "bg-green-500 animate-pulse" : "bg-black/20 dark:bg-white/20"}`} />
            <span className="text-[8px] uppercase tracking-[0.2em]">
                {status ? "Active_Online" : "Offline_Hidden"}
            </span>
        </button>
    );
}
