"use client";

import { useState } from "react";
import { updateCategory } from "../../create/actions";
import { useRouter } from "next/navigation";

interface EditCategoryFormProps {
    category: {
        id: string;
        name: string;
        name_uk: string | null;
        name_ru: string | null;
        name_pl: string | null;
        slug: string;
        image: string | null;
    };
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [activeLangTab, setActiveLangTab] = useState<string>("en");
    const [names, setNames] = useState<Record<string, string>>({
        en: category.name || "",
        uk: category.name_uk || "",
        ru: category.name_ru || "",
        pl: category.name_pl || "",
    });
    const [isTranslating, setIsTranslating] = useState(false);

    const handleNameChange = (lang: string, value: string) => {
        setNames(prev => ({ ...prev, [lang]: value }));
    };

    const handleAiTranslate = async () => {
        if (!names.en) {
            alert("Input_Primary_Source_First");
            return;
        }
        setIsTranslating(true);
        await new Promise(r => setTimeout(r, 800));
        setNames({
            en: names.en,
            uk: names.en,
            ru: names.en,
            pl: names.en,
        });
        setIsTranslating(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.set("name", names.en);
        formData.set("name_uk", names.uk);
        formData.set("name_ru", names.ru);
        formData.set("name_pl", names.pl);

        try {
            const result = await updateCategory(category.id, formData);
            if (result.success) {
                alert("MODIFICATION_COMMITTED_SUCCESSFULLY");
                router.push("/admin/categories");
                router.refresh();
            } else {
                alert("ERROR_CODE: " + result.error);
            }
        } catch (err) {
            console.error(err);
            alert("UNEXPECTED_SYSTEM_FAILURE");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-12 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 md:mb-12 space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-1 md:w-1.5 h-6 bg-black dark:bg-white" />
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black dark:text-white leading-none">
                            Modify_Root_Node
                        </h2>
                    </div>
                    <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 dark:text-white/40">
                        Category ID: {category.id.toUpperCase()} // Online
                    </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2 border-b border-black/[0.03] dark:border-white/[0.03] pb-1">
                        {[
                            { id: "en", label: "EN" },
                            { id: "uk", label: "UA" },
                            { id: "ru", label: "RU" },
                            { id: "pl", label: "PL" },
                        ].map(lang => (
                            <button
                                key={lang.id}
                                type="button"
                                onClick={() => setActiveLangTab(lang.id)}
                                className={`px-4 py-2 text-[9px] font-black tracking-widest transition-all ${activeLangTab === lang.id ? "text-black dark:text-white border-b-2 border-black dark:border-white" : "text-black/20 dark:text-white/20 hover:text-black/40"}`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAiTranslate}
                        disabled={isTranslating || !names.en}
                        className="flex items-center gap-2 group disabled:opacity-30"
                    >
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] border-b border-black/20 group-hover:border-black transition-all">
                            {isTranslating ? "Syncing..." : "Magic_Sync"}
                        </span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">
                                Category_Name ({activeLangTab.toUpperCase()})
                            </label>
                            {[
                                { id: "en", label: "EN" },
                                { id: "uk", label: "UA" },
                                { id: "ru", label: "RU" },
                                { id: "pl", label: "PL" },
                            ].map(lang => (
                                <input
                                    key={lang.id}
                                    type="text"
                                    value={names[lang.id]}
                                    onChange={(e) => handleNameChange(lang.id, e.target.value)}
                                    required={lang.id === "en"}
                                    className={`w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-bold tracking-widest outline-none focus:border-black dark:focus:border-white transition-all ${activeLangTab === lang.id ? "block" : "hidden"}`}
                                />
                            ))}
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">
                                Slug_Identifier
                            </label>
                            <input
                                id="slug-input"
                                type="text"
                                name="slug"
                                defaultValue={category.slug}
                                required
                                className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-mono font-bold tracking-tighter outline-none focus:border-black dark:focus:border-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase font-black tracking-widest mb-4 text-black dark:text-white">
                                Node_Graphic_Asset
                            </label>

                            {category.image && (
                                <div className="mb-6 p-4 border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-6">
                                    <img src={category.image} alt={category.name} className="w-24 h-24 object-cover grayscale brightness-90 border border-black/20 dark:border-white/20" />
                                    <div className="space-y-1 overflow-hidden">
                                        <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40">Current_Asset_Active</span>
                                        <p className="text-[9px] font-mono text-black/60 dark:text-white/60 break-all truncate">{category.image.split('/').pop()}</p>
                                    </div>
                                </div>
                            )}

                            <div className="border border-black/20 dark:border-white/20 p-8 text-center relative group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="space-y-1">
                                    <div className="text-[9px] text-black dark:text-white font-black uppercase tracking-[0.3em]">Overwrite_Asset</div>
                                    <div className="text-[8px] uppercase tracking-widest text-black/30 dark:text-white/30">Select New JPG / PNG / WEBP</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/categories")}
                            className="w-full md:flex-1 py-4 md:py-6 bg-transparent text-black dark:text-white text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.5em] border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                        >
                            __CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:flex-[2] py-4 md:py-6 bg-black dark:bg-white text-white dark:text-black text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.5em] border border-black dark:border-white hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all disabled:opacity-20"
                        >
                            {loading ? "PROCESSING..." : "SAVE_CHANGES"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
