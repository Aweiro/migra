"use client";

import { useState, useRef } from "react";
import { submitProduct } from "./actions";

interface Category {
    id: string;
    name: string;
    subcategories: { id: string; name: string }[];
}

export default function ProductForm({
    categories,
    brands = [],
}: {
    categories: Category[];
    brands?: string[];
}) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...newFiles]);

            const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const currentCategory = categories.find((c) => c.id === selectedCategoryId);
    const subcategories = currentCategory?.subcategories || [];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        images.forEach((img) => {
            formData.append("images", img);
        });

        try {
            const result = await submitProduct(formData);
            if (result.success) {
                alert("Product created successfully!");
                formRef.current?.reset();
                setImages([]);
                setPreviews([]);
                setSelectedCategoryId("");
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
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:bg-black/40">
            <div className="mb-8">
                <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Create New Product
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Add a new product to your catalog with high-quality images and details.
                </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                onChange={(e) => {
                                    const slugInput = document.getElementById("slug-input") as HTMLInputElement;
                                    if (slugInput && !slugInput.value.trim() && e.target.value) {
                                        slugInput.value = e.target.value.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "");
                                    }
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="Premium Wireless Headphones"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Slug
                            </label>
                            <input
                                id="slug-input"
                                type="text"
                                name="slug"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="premium-wireless-headphones"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="Describe your product beautifully..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Subcategory
                                </label>
                                <select
                                    name="subcategoryId"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:opacity-50 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    required
                                    disabled={!selectedCategoryId || subcategories.length === 0}
                                >
                                    <option value="" disabled>Select Subcategory</option>
                                    {subcategories.map((sc) => (
                                        <option key={sc.id} value={sc.id}>
                                            {sc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Media */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Price ($)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    placeholder="99.99"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Stock Units
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    defaultValue="0"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Sizes & Status */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    list="brand-list"
                                    placeholder="e.g. Nike, MIGRA, Apple"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                                <datalist id="brand-list">
                                    {brands.map((b) => (
                                        <option key={b} value={b} />
                                    ))}
                                </datalist>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Sizes (comma separated)
                                </label>
                                <input
                                    type="text"
                                    name="sizes"
                                    placeholder="e.g. S, M, L, XL"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10">
                                <input
                                    type="checkbox"
                                    name="isCustomOrder"
                                    id="isCustomOrder"
                                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <label htmlFor="isCustomOrder" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                    Enable as Custom Order (Pre-order/Made-to-order)
                                </label>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
                            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-4">Promotions & Discounts</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-gray-600 dark:text-gray-400">
                                        Discount %
                                    </label>
                                    <input
                                        type="number"
                                        name="discountPercent"
                                        step="0.01"
                                        defaultValue="0"
                                        max="100"
                                        min="0"
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-black/50 border border-indigo-500/20 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-gray-600 dark:text-gray-400">
                                        Direct Amount Off ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="discountAmount"
                                        step="0.01"
                                        defaultValue="0"
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-black/50 border border-indigo-500/20 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Uploader */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Product Images
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden group">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400 group-hover:text-purple-500 transition-colors"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                        <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                                            Upload files
                                        </span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</p>
                                </div>
                            </div>

                            {/* Previews */}
                            {previews.length > 0 && (
                                <div className="flex gap-4 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {previews.map((src, index) => (
                                        <div key={index} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-sm group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={src}
                                                alt={`Preview ${index}`}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-lg"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </span>
                        ) : (
                            "Save Product"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
