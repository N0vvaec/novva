"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/types";

export function cartKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}:${item.size ?? "-"}:${item.color ?? "-"}`;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "novva-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignorar carrito corrupto
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // sin espacio / modo privado
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = cartKey(item);
      const existing = prev.find((i) => cartKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          cartKey(i) === key ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => cartKey(i) !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (cartKey(i) === key ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, count, total, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
