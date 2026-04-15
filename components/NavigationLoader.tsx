"use client";

import { motion } from "framer-motion";

export function NavigationLoader() {
    const bars = Array.from({ length: 8 });

    return (
        <div className="flex flex-col items-center">
            {/* Sequential Rhythm Bars - Unambiguous Loading */}
            <div className="flex gap-2 mb-12">
                {bars.map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-[2px] h-8 bg-black"
                        initial={{ opacity: 0.1, scaleY: 0.8 }}
                        animate={{
                            opacity: [0.1, 1, 0.1],
                            scaleY: [0.8, 1.2, 0.8],
                            backgroundColor: ["#000", "#000", "#000"]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Brand Identity */}
            <motion.div
                className="flex gap-5"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                {["M", "I", "G", "R", "A"].map((char, i) => (
                    <span
                        key={i}
                        className="text-[14px] font-black tracking-[0.5em] text-black"
                    >
                        {char}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
