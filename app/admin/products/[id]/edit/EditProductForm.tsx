"use client";

import { useState } from "react";
import { editProductAction } from "../../create/actions";
import { useRouter } from "next/navigation";

interface EditProductFormProps {
    product: any;
    categories: any[];
}

export default function EditProductForm({
    product,
    categories,
    brands = [],
}: {
    product: any;
    categories: any[];
    brands?: string[];
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [existingImages, setExistingImages] = useState<string[]>(product.images || []);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(product.subcategory?.categoryId || "");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImages((prev) => [...prev, ...filesArray]);

            const previewsArray = filesArray.map((f) => URL.createObjectURL(f));
            setNewPreviews((prev) => [...prev, ...previewsArray]);
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const currentCategory = categories.find((c) => c.id === selectedCategoryId);
    const subcategories = currentCategory?.subcategories || [];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        newImages.forEach((img) => formData.append("images", img));

        try {
            const result = await editProductAction(product.id, formData, existingImages);
            if (result.success) {
                alert("Product updated successfully!");
                router.push("/admin/products");
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
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:bg-black/40">
            <div className="mb-8">
                <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Edit Product
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Update details for <strong>{product.name}</strong>.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
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
                                defaultValue={product.name}
                                required
                                onChange={(e) => {
                                    const slugInput = document.getElementById("slug-input") as HTMLInputElement;
                                    if (slugInput && !slugInput.value.trim() && e.target.value) {
                                        slugInput.value = e.target.value.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "");
                                    }
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 transition-all outline-none dark:text-white"
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
                                defaultValue={product.slug}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 transition-all outline-none dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                name="description"
                                defaultValue={product.description || ""}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 transition-all outline-none resize-none dark:text-white"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
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
                                    defaultValue={product.subcategoryId}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white disabled:opacity-50"
                                    required
                                    disabled={!selectedCategoryId || subcategories.length === 0}
                                >
                                    <option value="" disabled>Select Subcategory</option>
                                    {subcategories.map((sc: any) => (
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
                                    defaultValue={product.price}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    defaultValue={product.stock}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none dark:text-white"
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
                                    defaultValue={product.brand || ""}
                                    placeholder="e.g. Nike, MIGRA, Apple"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none dark:text-white"
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
                                    defaultValue={product.sizes?.join(", ")}
                                    placeholder="e.g. S, M, L, XL"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-purple-500 outline-none dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10">
                                <input
                                    type="checkbox"
                                    name="isCustomOrder"
                                    id="isCustomOrder"
                                    defaultChecked={product.isCustomOrder}
                                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <label htmlFor="isCustomOrder" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                    Enable as Custom Order (Pre-order/Made-to-order)
                                </label>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
                            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-4">Discounts</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-gray-600 dark:text-gray-400">
                                        Discount %
                                    </label>
                                    <input
                                        type="number"
                                        name="discountPercent"
                                        step="0.01"
                                        defaultValue={product.discountPercent}
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-black/50 border border-indigo-500/20 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-gray-600 dark:text-gray-400">
                                        Amount Off ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="discountAmount"
                                        step="0.01"
                                        defaultValue={product.discountAmount}
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-black/50 border border-indigo-500/20 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Images
                            </label>
                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="flex gap-4 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {existingImages.map((src, idx) => (
                                        <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-sm group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={src} alt={`Current ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >×</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer" />

                            {newPreviews.length > 0 && (
                                <div className="flex gap-4 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {newPreviews.map((src, idx) => (
                                        <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-sm group opacity-75">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={src} alt={`New ${idx}`} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeNewImage(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-4">
                    <button type="button" onClick={() => router.push("/admin/products")} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all outline-none">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
