"use client";

import { useState, useEffect, useRef } from "react";
import { editProductAction } from "../../create/actions";
import { useRouter } from "next/navigation";

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

    // Custom Select States
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(product.subcategory?.categoryId || "");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(product.subcategoryId || "");
    const [selectedLabel, setSelectedLabel] = useState<string>(product.label || "");
    const [brandQuery, setBrandQuery] = useState(product.brand || "");

    // Pre-calculate Sale Price
    const initialPrice = Number(product.price);
    const initialDiscountVal = Number(product.discountAmount || 0);
    const initialSalePrice = initialPrice - initialDiscountVal;

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

    const labelOptions = [
        { value: "", label: "__NONE__" },
        { value: "BESTSELLER", label: "BESTSELLER" },
        { value: "NEW", label: "NEW_COLLECTION" },
        { value: "SALE", label: "SALE_REDUCTION" },
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        // Manual append for custom selects
        formData.set("subcategoryId", selectedSubcategoryId);
        formData.set("label", selectedLabel);
        formData.set("brand", brandQuery);

        newImages.forEach((img) => formData.append("images", img));

        try {
            const result = await editProductAction(product.id, formData, existingImages);
            if (result.success) {
                alert("MODIFICATION_COMMITTED_SUCCESSFULLY");
                router.push("/admin/products");
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
            const target = event.target as HTMLElement;
            if (!target.closest('[data-dropdown-container]')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto py-12 px-6 overflow-x-hidden">
            <div className="mb-8 md:mb-16 space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-1 md:w-1.5 h-6 bg-black dark:bg-white" />
                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-black dark:text-white">Modify_Entity</h1>
                </div>
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 dark:text-white/40">
                    Product ID: {product.id.toUpperCase()} // Status: ONLINE
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-12">
                    {/* Identification */}
                    <div className="space-y-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">01 // Primary Identification</span>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={product.name}
                                    required
                                    className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-bold uppercase tracking-widest outline-none focus:border-black dark:focus:border-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">Slug_Identifier</label>
                                <input
                                    type="text"
                                    name="slug"
                                    defaultValue={product.slug}
                                    required
                                    className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-mono font-bold tracking-tighter outline-none focus:border-black dark:focus:border-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">Documentation</label>
                                <textarea
                                    name="description"
                                    defaultValue={product.description || ""}
                                    rows={4}
                                    className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-bold uppercase tracking-widest outline-none focus:border-black dark:focus:border-white transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mapping */}
                    <div className="space-y-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">02 // Structural Mapping</span>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Custom Category Select */}
                            <div className="relative" data-dropdown-container>
                                <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">Category</label>
                                <button
                                    type="button"
                                    onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                                    className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-[10px] text-black dark:text-white font-black uppercase tracking-widest outline-none flex justify-between items-center"
                                >
                                    <span>{categories.find((c: any) => c.id === selectedCategoryId)?.name.toUpperCase() || "__SELECT__"}</span>
                                    <svg className={`w-3 h-3 transition-transform ${openDropdown === "category" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openDropdown === "category" && (
                                    <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-black border border-black dark:border-white shadow-2xl max-h-48 overflow-y-auto no-scrollbar">
                                        {categories.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCategoryId(c.id);
                                                    setSelectedSubcategoryId("");
                                                    setOpenDropdown(null);
                                                }}
                                                className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-b border-black/5"
                                            >
                                                {c.name.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Custom Subcategory Select */}
                            <div className="relative" data-dropdown-container>
                                <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">Subcategory</label>
                                <button
                                    type="button"
                                    disabled={!selectedCategoryId || subcategories.length === 0}
                                    onClick={() => setOpenDropdown(openDropdown === "subcategory" ? null : "subcategory")}
                                    className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-[10px] text-black dark:text-white font-black uppercase tracking-widest outline-none flex justify-between items-center disabled:opacity-20"
                                >
                                    <span>{subcategories.find((s: any) => s.id === selectedSubcategoryId)?.name.toUpperCase() || "__SELECT__"}</span>
                                    <svg className={`w-3 h-3 transition-transform ${openDropdown === "subcategory" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openDropdown === "subcategory" && (
                                    <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-black border border-black dark:border-white shadow-2xl max-h-48 overflow-y-auto no-scrollbar">
                                        {subcategories.map((sc: any) => (
                                            <button
                                                key={sc.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSubcategoryId(sc.id);
                                                    setOpenDropdown(null);
                                                }}
                                                className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-b border-black/5"
                                            >
                                                {sc.name.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="space-y-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">03 // System Attribution</span>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Brand Input with Placeholder */}
                            <div className="relative" data-dropdown-container>
                                <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">Brand</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    value={brandQuery}
                                    onChange={(e) => {
                                        setBrandQuery(e.target.value);
                                        setOpenDropdown("brand");
                                    }}
                                    onFocus={() => setOpenDropdown("brand")}
                                    placeholder="MIGRA_CORE / ARCHIVE"
                                    className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-[10px] text-black dark:text-white font-black uppercase tracking-widest outline-none"
                                />
                                {openDropdown === "brand" && (
                                    <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-black border border-black dark:border-white shadow-2xl max-h-48 overflow-y-auto no-scrollbar">
                                        {brandQuery && !brands.some(b => b.toLowerCase() === brandQuery.toLowerCase()) && (
                                            <button
                                                type="button"
                                                onClick={() => { setBrandQuery(brandQuery); setOpenDropdown(null); }}
                                                className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-b border-black/5"
                                            >
                                                [+] Add_New: {brandQuery.toUpperCase()}
                                            </button>
                                        )}
                                        {brands.filter(b => b.toLowerCase().includes(brandQuery.toLowerCase())).map((b) => (
                                            <button
                                                key={b}
                                                type="button"
                                                onClick={() => { setBrandQuery(b); setOpenDropdown(null); }}
                                                className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-b border-black/5"
                                            >
                                                {b.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Custom Special Label Select */}
                            <div className="relative" data-dropdown-container>
                                <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">Special Label</label>
                                <button
                                    type="button"
                                    onClick={() => setOpenDropdown(openDropdown === "label" ? null : "label")}
                                    className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-[10px] text-black dark:text-white font-black uppercase tracking-widest outline-none flex justify-between items-center"
                                >
                                    <span>{labelOptions.find(l => l.value === selectedLabel)?.label || "__NONE__"}</span>
                                    <svg className={`w-3 h-3 transition-transform ${openDropdown === "label" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openDropdown === "label" && (
                                    <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-black border border-black dark:border-white shadow-2xl max-h-48 overflow-y-auto no-scrollbar">
                                        {labelOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedLabel(opt.value);
                                                    setOpenDropdown(null);
                                                }}
                                                className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-b border-black/5"
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-4 border-y border-black/5 dark:border-white/5">
                            <input
                                type="checkbox"
                                name="isCustomOrder"
                                id="isCustomOrder"
                                defaultChecked={product.isCustomOrder}
                                className="w-4 h-4 rounded-none border-black/20 dark:border-white/20 text-black dark:text-white focus:ring-black accent-black"
                            />
                            <label htmlFor="isCustomOrder" className="text-[10px] uppercase font-black tracking-widest text-black/60 dark:text-white/60 cursor-pointer">
                                Enable_Custom_Order_Protocol (Pre-order)
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Metrics */}
                    <div className="space-y-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">04 // Economic Metrics</span>

                        <div className="space-y-4">
                            <label className="block text-[10px] uppercase font-black tracking-widest text-black dark:text-white">Pricing Structure</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
                                <div>
                                    <label className="block text-[8px] uppercase font-bold mb-2 text-black/40 dark:text-white/40">Base Price (Original $)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        defaultValue={product.price}
                                        required
                                        placeholder="0.00"
                                        className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-bold outline-none focus:border-black dark:focus:border-white transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[8px] uppercase font-bold mb-2 text-black/40 dark:text-white/40">Sale Price (Current $)</label>
                                    <input
                                        type="number"
                                        name="salePrice"
                                        step="0.01"
                                        defaultValue={initialSalePrice < initialPrice ? initialSalePrice : ""}
                                        placeholder="No Discount"
                                        className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-bold outline-none focus:border-black dark:focus:border-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-black dark:text-white">Inventory Management</label>
                            <input
                                type="number"
                                name="stock"
                                defaultValue={product.stock}
                                placeholder="0"
                                className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-bold outline-none focus:border-black dark:focus:border-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">05 // Physical Dimension Matrix</span>
                        <div>
                            <label className="block text-[10px] uppercase font-black tracking-widest mb-4 text-black dark:text-white">Sizes (Input as CSV)</label>
                            <input
                                type="text"
                                name="sizes"
                                defaultValue={product.sizes?.join(", ")}
                                placeholder="XS, S, M, L, XL, OS"
                                className="w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 px-4 py-4 rounded-none text-xs text-black dark:text-white font-bold uppercase tracking-widest outline-none focus:border-black dark:focus:border-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Assets */}
                    <div className="space-y-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">06 // Visual Assets Protocol</span>

                        {/* Existing Assets */}
                        {existingImages.length > 0 && (
                            <div className="space-y-2">
                                <label className="block text-[8px] uppercase font-black tracking-widest text-black/40">Current_Assets_In_Database</label>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                    {existingImages.map((src, index) => (
                                        <div key={index} className="aspect-square relative border border-black/10 p-1 group">
                                            <img src={src} className="w-full h-full object-cover grayscale brightness-90" alt="" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-black"
                                            >
                                                REMOVE
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border border-black/20 dark:border-white/20 p-8 text-center relative group cursor-pointer hover:bg-black/[0.02] transition-all">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="space-y-2">
                                <div className="text-[10px] text-black dark:text-white font-black uppercase tracking-[0.4em]">Asset_Sync_Protocol</div>
                                <div className="text-[8px] uppercase tracking-widest text-black/30 dark:text-white/30">Append New Content Content</div>
                            </div>
                        </div>

                        {newPreviews.length > 0 && (
                            <div className="space-y-2">
                                <label className="block text-[8px] uppercase font-black tracking-widest text-black/40">Pending_Assets_For_Commit</label>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                    {newPreviews.map((src, index) => (
                                        <div key={index} className="aspect-square relative border border-black/10 p-1 group border-dashed">
                                            <img src={src} className="w-full h-full object-cover grayscale brightness-90" alt="" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-black"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/products")}
                            className="w-full md:flex-1 py-4 md:py-6 bg-transparent text-black dark:text-white text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.5em] border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                        >
                            __CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:flex-[2] py-4 md:py-6 bg-black dark:bg-white text-white dark:text-black text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.5em] border border-black dark:border-white hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all disabled:opacity-20"
                        >
                            {loading ? "PROCESSING_SYNC..." : "SAVE_CHANGES"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
