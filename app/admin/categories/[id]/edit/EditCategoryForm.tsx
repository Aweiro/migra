"use client";

import { useState } from "react";
import { updateCategory } from "../../create/actions";
import { useRouter } from "next/navigation";

interface EditCategoryFormProps {
    category: {
        id: string;
        name: string;
        slug: string;
        image: string | null;
    };
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

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
        <div className="max-w-2xl mx-auto py-12 px-6">
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

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">
                            Category_Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={category.name}
                            required
                            className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-bold uppercase tracking-widest outline-none focus:border-black dark:focus:border-white transition-all"
                        />
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
    );
}
