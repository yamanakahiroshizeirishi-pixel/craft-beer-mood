"use client";

import { useState, useEffect } from "react";
import type { Beer } from "@/lib/beerData";

export default function PurchaseBox({ beer }: { beer: Beer }) {
  const quantities = [1, 3, 6, 12];
  const [selectedQty, setSelectedQty] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.reduce((sum: number, item: { qty: number }) => sum + item.qty, 0));
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: { id: string }) => item.id === beer.id);
    if (existing) {
      existing.qty += selectedQty;
    } else {
      cart.push({ id: beer.id, name: beer.name, price: beer.price, qty: selectedQty });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    const total = cart.reduce((sum: number, item: { qty: number }) => sum + item.qty, 0);
    setCartCount(total);
    showToast(`🛒 カートに追加しました（${selectedQty}本）`);
  }

  function buyNow() {
    addToCart();
    showToast(`✅ ご注文を承りました！（${selectedQty}本 ¥${(beer.price * selectedQty).toLocaleString()}）`);
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Cart badge */}
      {cartCount > 0 && (
        <div className="flex justify-end mb-2">
          <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
            🛒 {cartCount}本
          </span>
        </div>
      )}

      {/* Purchase Box */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky bottom-4">
        <h2 className="font-bold text-gray-700 mb-4">数量を選んで購入</h2>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {quantities.map((qty) => (
            <button
              key={qty}
              onClick={() => setSelectedQty(qty)}
              className={`py-3 rounded-xl border-2 text-center transition-all ${
                selectedQty === qty
                  ? "border-amber-500 bg-amber-50"
                  : "border-amber-200 hover:border-amber-400 hover:bg-amber-50"
              }`}
            >
              <p className={`font-bold ${selectedQty === qty ? "text-amber-700" : "text-gray-700"}`}>
                {qty}本
              </p>
              <p className={`text-xs ${selectedQty === qty ? "text-amber-600" : "text-gray-400"}`}>
                ¥{(beer.price * qty).toLocaleString()}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={addToCart}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-lg mb-3"
        >
          🛒 カートに追加（{selectedQty}本 ¥{(beer.price * selectedQty).toLocaleString()}）
        </button>
        <button
          onClick={buyNow}
          className="w-full py-3 border-2 border-amber-400 text-amber-600 hover:bg-amber-50 font-bold rounded-xl transition-colors"
        >
          今すぐ購入
        </button>
      </div>
    </>
  );
}
