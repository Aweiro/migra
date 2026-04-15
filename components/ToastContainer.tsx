"use client";

import { useToast, ToastType } from "@/lib/stores/toast.store";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const getIcon = (type: ToastType) => {
    switch (type) {
        case "success":
            return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>;
        case "error":
            return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>;
        case "warning":
            return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" /></svg>;
        default:
            return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
};

const getColor = (type: ToastType) => {
    switch (type) {
        case "success": return "bg-black text-white dark:bg-white dark:text-black";
        case "error": return "bg-red-500 text-white";
        case "warning": return "bg-amber-500 text-white";
        default: return "bg-zinc-100 text-black border border-black/5";
    }
};

export function ToastContainer() {
    const { toasts, removeToast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100000] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        layout
                        className={`pointer-events-auto flex items-center justify-between px-5 py-4 shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-black/5 backdrop-blur-md ${getColor(toast.type)}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">{getIcon(toast.type)}</div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none whitespace-pre-wrap">
                                {toast.message}
                            </span>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-6 opacity-40 hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
