import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "../types";
import { useSettings } from "./SettingsContext";

export interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  calculatedDiscount: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedFinish?: string) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  cartCount: number;
  cartTotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  appliedCoupon: AppliedCoupon | null;
  discountAmount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
  grandTotal: number;
}

const STORAGE_KEY = "jabour-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1, selectedFinish?: string) => {
    const finish = selectedFinish || (product.finishes && product.finishes.length > 0 ? product.finishes[0] : "");
    const key = `${product.handle}|${finish}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            key,
            productId: product.id,
            handle: product.handle,
            title: product.title,
            price: product.price,
            image: product.images[0] || "",
            selectedFinish: finish,
            quantity
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const updateQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(key);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const freeShippingThreshold = settings?.freeShippingThreshold ?? 50;
  const standardShipping = settings?.shippingFee ?? 5;
  const shippingFee = items.length === 0 ? 0 : cartTotal >= freeShippingThreshold ? 0 : standardShipping;

  // Recalculate discount whenever cartTotal changes
  let discountAmount = 0;
  if (appliedCoupon && cartTotal > 0) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discountAmount = (cartTotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscount && appliedCoupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
      }
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, cartTotal);
    }
    discountAmount = Math.round(discountAmount * 100) / 100;
  }

  const grandTotal = Math.max(0, Math.round((cartTotal - discountAmount + shippingFee) * 100) / 100);

  const applyCoupon = async (code: string): Promise<{ success: boolean; error?: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, error: "Please enter a coupon code." };
    }

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode, subtotal: cartTotal })
      });
      const data = await res.json();

      if (data.success && data.data) {
        setAppliedCoupon({
          code: data.data.code,
          discountType: data.data.discountType,
          discountValue: data.data.discountValue,
          calculatedDiscount: data.data.calculatedDiscount,
          minOrderAmount: data.data.minOrderAmount,
          maxDiscount: data.data.maxDiscount
        });
        return { success: true };
      } else {
        return { success: false, error: data.error || "Invalid coupon code." };
      }
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to validate coupon." };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        cartCount,
        cartTotal,
        shippingFee,
        freeShippingThreshold,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        grandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
