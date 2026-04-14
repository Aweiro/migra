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
                alert("Category updated successfully!");
                router.push("/admin/categories");
                router.refresh();
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
                    Edit Category
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Update the details for <strong>{category.name}</strong>.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Category Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={category.name}
                        required
                        onChange={(e) => {
                            const slugInput = document.getElementById("slug-input") as HTMLInputElement;
                            if (slugInput && !slugInput.value.trim() && e.target.value) {
                                slugInput.value = e.target.value.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "");
                            }
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
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
                        defaultValue={category.slug}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Category Image (Optional)
                    </label>
                    {category.image && (
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Current Image:</p>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={category.image} alt={category.name} className="w-32 h-auto rounded-xl shadow-md border border-gray-200 dark:border-white/10" />
                        </div>
                    )}
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
                    />
                    <p className="text-xs text-gray-400 mt-2">Upload a new file to replace the existing image. Leaving this empty keeps the current image.</p>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/categories")}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-teal-500/50 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
