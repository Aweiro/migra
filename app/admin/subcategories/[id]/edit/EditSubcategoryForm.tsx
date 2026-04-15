"use client";

import { useState, useRef, useEffect } from "react";
import { updateSubcategory } from "../../../categories/create/actions";
import { useRouter } from "next/navigation";

interface EditSubcategoryFormProps {
    subcategory: {
        id: string;
        name: string;
        slug: string;
        categoryId: string;
    };
    categories: { id: string; name: string }[];
}

export default function EditSubcategoryForm({ subcategory, categories }: EditSubcategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [selectedCategoryId, setSelectedCategoryId] = useState(subcategory.categoryId);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.set("categoryId", selectedCategoryId);

        try {
            const result = await updateSubcategory(subcategory.id, formData);
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="mb-8 md:mb-12 space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-1 md:w-1.5 h-6 bg-black dark:bg-white" />
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black dark:text-white leading-none">
                        Modify_Sub_Node
                    </h2>
                </div>
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 dark:text-white/40">
                    Subcategory ID: {subcategory.id.toUpperCase()} // Online
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">
                            Sub_Node_Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={subcategory.name}
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
                            defaultValue={subcategory.slug}
                            required
                            className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-mono font-bold tracking-tighter outline-none focus:border-black dark:focus:border-white transition-all"
                        />
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">
                            Parent_Node_Assignment
                        </label>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-[10px] text-black dark:text-white font-black uppercase tracking-widest outline-none flex justify-between items-center"
                        >
                            <span>{categories.find(c => c.id === selectedCategoryId)?.name.toUpperCase() || "__SELECT_PARENT__"}</span>
                            <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-black border border-black dark:border-white shadow-2xl max-h-48 overflow-y-auto no-scrollbar">
                                {categories.map((c) => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategoryId(c.id);
                                            setDropdownOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-b border-black/5"
                                    >
                                        {c.name.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        )}
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
