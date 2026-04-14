"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WishlistProduct = {
    id: string;
    title: string;
    price: number;
    image?: string;
    slug: string;
    sizes?: string[];
};

type WishlistStore = {
    items: WishlistProduct[];
    addToWishlist: (product: WishlistProduct) => void;
    removeFromWishlist: (productId: string) => void;
    isWishlisted: (productId: string) => boolean;
    clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToWishlist: (product) => {
                set((state) => {
                    const exists = state.items.find((item) => item.id === product.id);
                    if (exists) return state;
                    return { items: [...state.items, product] };
                });
            },
            removeFromWishlist: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }));
            },
            isWishlisted: (productId) => {
                return get().items.some((item) => item.id === productId);
            },
            clearWishlist: () => {
                set({ items: [] });
            },
        }),
        {
            name: "migra-wishlist",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                items: state.items,
            }),
        },
    ),
);
