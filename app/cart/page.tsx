"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCartStore, calculateCartTotal } from "@/lib/stores/cart.store";
import { Footer } from "@/components/Footer";
import { CheckoutModal } from "@/components/CheckoutModal";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = calculateCartTotal(items);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <main className="flex-1 flex flex-col min-h-screen justify-between bg-white pt-6 border-t border-black/[0.03]">
      <div className="mx-auto w-full max-w-[1500px] px-6 mb-16">
        <div className="flex items-center justify-between border-b border-black/[0.1] pb-6 mb-12">
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-black text-black/30">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <span className="text-black">Cart</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/20">MIGRA®</span>
            <div className="w-12 h-[1px] bg-black/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-black" />
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-black">Library Cart</span>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-8 text-center">
            <div className="text-[80px] leading-none opacity-5 font-black uppercase tracking-tighter select-none">Empty</div>
            <div className="space-y-3">
              <h1 className="text-2xl font-black uppercase tracking-tighter text-black">Your Cart is Empty</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/30">Add pieces to your library to begin</p>
            </div>
            <Link
              href="/"
              className="mt-4 bg-black text-white px-8 py-3 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black/90 transition-colors"
            >
              Explore the Archive
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
            {/* Items */}
            <div className="space-y-0">
              <div className="hidden md:grid grid-cols-[1fr_120px_100px_80px] gap-8 pb-4 border-b border-black/[0.07] mb-0">
                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/30">Item</span>
                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/30 text-center">Qty</span>
                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/30 text-right">Price</span>
                <span></span>
              </div>
              {items.map((item, i) => (
                <div key={item.id} className={`grid grid-cols-1 md:grid-cols-[1fr_120px_100px_80px] gap-6 md:gap-8 py-8 items-center ${i < items.length - 1 ? "border-b border-black/[0.05]" : ""}`}>
                  {/* Product info */}
                  <div className="flex items-center gap-5">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-[#f9f9f9] overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] uppercase tracking-widest text-black/20 font-bold">No Image</div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-[11px] uppercase tracking-[0.2em] font-black text-black leading-tight">{item.title}</h2>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/30">€{item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between border border-black/10">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center text-black/40 hover:text-black text-lg transition-colors"
                    >−</button>
                    <span className="w-8 text-center text-[11px] font-black text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-black/40 hover:text-black text-lg transition-colors"
                    >+</button>
                  </div>

                  {/* Line total */}
                  <span className="text-[11px] font-black tracking-widest text-right text-black">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[9px] uppercase tracking-[0.3em] font-bold text-black/30 hover:text-black transition-colors text-right md:text-left"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="pt-6 flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-[9px] uppercase tracking-[0.3em] font-bold text-black/30 hover:text-black transition-colors border-b border-black/20 hover:border-black pb-0.5"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="h-fit border border-black/[0.08] p-8 space-y-8 sticky top-24">
              <h2 className="text-[11px] uppercase tracking-[0.5em] font-black border-b border-black/[0.08] pb-6 text-black">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-black/40">
                  <span>Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-black/40">
                  <span>Shipping</span>
                  <span>{totalPrice >= 200 ? "Complimentary" : "Calculated at checkout"}</span>
                </div>
                <div className="border-t border-black/[0.06] pt-4 flex justify-between">
                  <span className="text-[11px] uppercase tracking-[0.3em] font-black text-black">Total</span>
                  <span className="text-[13px] font-black tracking-widest text-black">€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="block w-full bg-black text-white text-center py-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black/90 transition-colors"
                >
                  Proceed to Checkout
                </button>
                <Link
                  href="/"
                  className="block w-full border border-black/10 text-center py-3 text-[10px] uppercase tracking-[0.4em] font-bold text-black hover:border-black transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {totalPrice < 200 && (
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/30 text-center">
                  Add €{(200 - totalPrice).toFixed(2)} more for complimentary shipping
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <Footer />
    </main>
  );
}
