"use client";

import { useState, useRef } from "react";
import { createCategory, createSubcategory } from "./actions";

interface Category {
    id: string;
    name: string;
}

export default function CategoryForm({ categories }: { categories: Category[] }) {
    const [activeTab, setActiveTab] = useState<"category" | "subcategory">("category");
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            let result;
            if (activeTab === "category") {
                result = await createCategory(formData);
            } else {
                result = await createSubcategory(formData);
            }

            if (result.success) {
                alert(`${activeTab === "category" ? "Category" : "Subcategory"} created successfully!`);
                formRef.current?.reset();

                // Refresh page to get latest data
                window.location.reload();
            } else {
                alert("Error: " + result.error);
            }
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:bg-black/40">
            <div className="mb-8">
                <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    Create Classification
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Organize your product catalog by adding a new Category or Subcategory.
                </p>
            </div>

            <div className="flex gap-4 mb-8 bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl">
                <button
                    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === "category"
                        ? "bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-md"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                    onClick={() => setActiveTab("category")}
                >
                    New Category
                </button>
                <button
                    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === "subcategory"
                        ? "bg-white dark:bg-white/10 text-teal-600 dark:text-teal-400 shadow-md"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                    onClick={() => setActiveTab("subcategory")}
                >
                    New Subcategory
                </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            {activeTab === "category" ? "Category Name" : "Subcategory Name"}
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            onChange={(e) => {
                                // Auto-fill slug
                                const slugInput = document.getElementById("slug-input") as HTMLInputElement;
                                if (slugInput && !slugInput.value.trim() && e.target.value) {
                                    slugInput.value = e.target.value.toLowerCase().replace(/\\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                                }
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                            placeholder={activeTab === "category" ? "e.g. Electronics" : "e.g. Headphones"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Slug (URL)
                        </label>
                        <input
                            id="slug-input"
                            type="text"
                            name="slug"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                            placeholder={activeTab === "category" ? "electronics" : "headphones"}
                        />
                    </div>

                    {activeTab === "category" && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Category Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    )}

                    {activeTab === "subcategory" && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Parent Category
                            </label>
                            <select
                                name="categoryId"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                            >
                                <option value="" disabled selected>
                                    Select a category
                                </option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-teal-500/50 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? "Saving..." : activeTab === "category" ? "Create Category" : "Create Subcategory"}
                    </button>
                </div>
            </form>
        </div>
    );
}
