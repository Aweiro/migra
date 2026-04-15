import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-black text-white pt-12 md:pt-32 pb-12 px-6 overflow-hidden">
            <div className="mx-auto max-w-[1800px]">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-14 lg:gap-16 mb-6 md:mb-32">
                    {/* Brand Column */}
                    <div className="space-y-10 lg:col-span-1">
                        <div>
                            <h2 className="text-4xl font-black tracking-[0.3em] mb-4">MIGRA</h2>
                            <p className="text-[11px] uppercase tracking-[0.2em] leading-loose text-white/40 max-w-xs">
                                Contextual shop for the contemporary existence. Minimalist by nature. Ethical by design. Est. 2026.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {['IG', 'TW', 'FB', 'YT'].map(social => (
                                <span key={social} className="w-12 h-12 border border-white/10 flex items-center justify-center text-[10px] font-bold hover:bg-white hover:text-black transition-all duration-300 cursor-pointer group">
                                    <span className="group-hover:scale-110 transition-transform">{social}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-12">
                        {[
                            { title: "Store", links: ["All Products", "New Arrivals", "Archives", "Sale"] },
                            { title: "About", links: ["Our Story", "Manufacturing", "Sustainability", "Materials"] },
                            { title: "Support", links: ["Shipping", "Returns", "Contact", "FAQ", "Track Order"] }
                        ].map((col, i) => (
                            <div key={i} className="space-y-8">
                                <h4 className="text-[12px] uppercase tracking-[0.4em] font-black">{col.title}</h4>
                                <ul className="space-y-5">
                                    {col.links.map(link => (
                                        <li key={link} className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white hover:translate-x-1 transition-all cursor-pointer inline-block w-full">
                                            {link}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter Column */}
                    <div className="space-y-10 lg:col-span-1">
                        <div className="space-y-6">
                            <h4 className="text-[12px] uppercase tracking-[0.4em] font-black">Join The Context</h4>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 leading-loose">
                                Subscribe to receive exclusive access to new drops and archival releases.
                            </p>
                        </div>
                        <div className="flex border-b border-white/20 focus-within:border-white transition-all duration-500 pb-3 group">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="bg-transparent border-none outline-none text-[10px] uppercase tracking-[0.3em] w-full placeholder:text-white/60"
                            />
                            <button className="text-[12px] font-bold group-hover:translate-x-2 transition-transform px-4">
                                &rarr;
                            </button>
                        </div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                            By subscribing you agree to our <span className="underline cursor-pointer hover:text-white">Privacy Policy</span>.
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Line */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-10 gap-y-4 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Cookie Settings</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Accessibility</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">
                        MIGRA © 2026. CONTEXTUAL LIBRARY.
                    </div>
                </div>
            </div>
        </footer>
    );
}
