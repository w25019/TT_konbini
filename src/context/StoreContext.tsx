"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product, products } from "../data/products";

// DATA TYPES
// These types describe the shape of cart, user, address, and order data.
export type CartItem = { product: Product; quantity: number };
export type Profile = { name: string; email: string; phone: string };
export type Address = {
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  street: string;
  building: string;
  phone: string;
};
export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  fee: number;
  total: number;
  payment: string;
  deliveryDate: string;
  deliveryTime: string;
  note: string;
  status: string;
};
type OrderDetails = {
  shipping: number;
  fee: number;
  payment: string;
  deliveryDate: string;
  deliveryTime: string;
  note: string;
};
type Store = {
  items: CartItem[];
  favorites: string[];
  orders: Order[];
  toast: string;
  hydrated: boolean;
  isAuthenticated: boolean;
  profile: Profile;
  address: Address | null;
  couponCode: string;
  couponApplied: boolean;
  discount: number;
  points: number;
  add: (p: Product, n?: number) => void;
  remove: (id: string) => void;
  change: (id: string, n: number) => void;
  clear: () => void;
  toggleFavorite: (id: string) => void;
  applyCoupon: (code: string) => boolean;
  clearCoupon: () => void;
  placeOrder: (details: OrderDetails) => Order | null;
  login: (email: string) => void;
  logout: () => void;
  saveProfile: (profile: Profile) => void;
  saveAddress: (address: Address) => void;
  notify: (message: string) => void;
  subtotal: number;
  count: number;
};
const C = createContext<Store | null>(null);
const defaultProfile: Profile = { name: "", email: "", phone: "" };

// LOCAL STORAGE READER
// Reads saved browser data. If nothing is saved, it returns the fallback value.
function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // STORE STATE
  // These values are shared by all pages inside StoreProvider.
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [address, setAddress] = useState<Address | null>(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState("");
  // LOAD SAVED DATA
  // This runs once when the website first opens in the browser.
  useEffect(() => {
    setItems(read("tt-cart", []));
    setFavorites(read("tt-favs", []));
    setOrders(read("tt-orders", []));
    setProfile(read("tt-profile", defaultProfile));
    setAddress(read("tt-address", null));
    setAuthenticated(read("tt-auth", false));
    setCouponApplied(read("tt-coupon", false));
    setHydrated(true);
  }, []);
  // SAVE CHANGES
  // Whenever store data changes, save the newest values in localStorage.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("tt-cart", JSON.stringify(items));
    localStorage.setItem("tt-favs", JSON.stringify(favorites));
    localStorage.setItem("tt-orders", JSON.stringify(orders));
    localStorage.setItem("tt-profile", JSON.stringify(profile));
    localStorage.setItem("tt-address", JSON.stringify(address));
    localStorage.setItem("tt-auth", JSON.stringify(isAuthenticated));
    localStorage.setItem("tt-coupon", JSON.stringify(couponApplied));
  }, [
    items,
    favorites,
    orders,
    profile,
    address,
    isAuthenticated,
    couponApplied,
    hydrated,
  ]);
  // TOAST MESSAGE
  // Shows a short message at the bottom of the screen.
  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }, []);
  // CART CALCULATIONS
  // reduce() adds all item prices and quantities together.
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const points =
    320 + orders.reduce((sum, o) => sum + Math.floor(o.total / 100), 0);
  useEffect(() => {
    if (hydrated && subtotal === 0 && couponApplied) setCouponApplied(false);
  }, [subtotal, couponApplied, hydrated]);
  // ADD TO CART
  // Adds a new product or increases its quantity without passing stock.
  const add = useCallback(
    (product: Product, quantity = 1) => {
      if (product.stock < 1) {
        notify("この商品は在庫切れです");
        return;
      }
      setItems((current) => {
        const found = current.find((i) => i.product.id === product.id);
        const currentQty = found?.quantity || 0;
        const next = Math.min(
          product.stock,
          currentQty + Math.max(1, quantity),
        );
        if (next === currentQty) {
          notify(`在庫上限（${product.stock}点）に達しています`);
          return current;
        }
        return found
          ? current.map((i) =>
              i.product.id === product.id ? { ...i, quantity: next } : i,
            )
          : [...current, { product, quantity: next }];
      });
      notify(`${product.name}をカートに追加しました`);
    },
    [notify],
  );
  // CHANGE QUANTITY
  // Keeps quantity between 1 and the product's available stock.
  const change = useCallback(
    (id: string, n: number) => {
      setItems((current) =>
        current.flatMap((item) => {
          if (item.product.id !== id) return [item];
          if (n < 1) return [];
          if (n > item.product.stock) {
            notify(`在庫は${item.product.stock}点までです`);
            return [{ ...item, quantity: item.product.stock }];
          }
          return [{ ...item, quantity: n }];
        }),
      );
    },
    [notify],
  );
  // APPLY COUPON
  // WELCOME10 gives a 10% discount when the cart is not empty.
  const applyCoupon = useCallback(
    (code: string) => {
      const valid = code.trim().toUpperCase() === "WELCOME10" && subtotal > 0;
      setCouponApplied(valid);
      notify(
        valid ? "WELCOME10を適用しました" : "クーポンコードが正しくありません",
      );
      return valid;
    },
    [subtotal, notify],
  );
  const clearCoupon = useCallback(() => setCouponApplied(false), []);
  // PLACE ORDER
  // Creates an order, saves it in history, then clears cart and coupon data.
  const placeOrder = useCallback(
    (details: OrderDetails) => {
      if (!items.length) return null;
      const now = new Date();
      const currentDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
      const total = subtotal + details.shipping + details.fee - currentDiscount;
      const order: Order = {
        ...details,
        id: `TT${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(Date.now()).slice(-6)}`,
        createdAt: now.toISOString(),
        items: items.map((i) => ({ ...i })),
        subtotal,
        discount: currentDiscount,
        total,
        status: "注文受付",
      };
      setOrders((current) => [order, ...current]);
      setItems([]);
      setCouponApplied(false);
      notify("ご注文を受け付けました");
      return order;
    },
    [items, subtotal, couponApplied, notify],
  );
  // DEMO LOGIN / LOGOUT
  // This is browser-only demo authentication, not secure server authentication.
  const login = useCallback((email: string) => {
    setProfile((current) => ({ ...current, email }));
    setAuthenticated(true);
  }, []);
  const logout = useCallback(() => {
    setAuthenticated(false);
    notify("ログアウトしました");
  }, [notify]);
  // SHARED STORE VALUE
  // useMemo creates the object that every page receives from useStore().
  const value = useMemo<Store>(
    () => ({
      items,
      favorites,
      orders,
      toast,
      hydrated,
      isAuthenticated,
      profile,
      address,
      couponCode: couponApplied ? "WELCOME10" : "",
      couponApplied,
      discount,
      points,
      add,
      remove: (id) => {
        setItems((x) => x.filter((i) => i.product.id !== id));
        notify("商品を削除しました");
      },
      change,
      clear: () => {
        setItems([]);
        setCouponApplied(false);
        notify("カートを空にしました");
      },
      toggleFavorite: (id) => {
        setFavorites((x) =>
          x.includes(id) ? x.filter((v) => v !== id) : [...x, id],
        );
        notify("お気に入りを更新しました");
      },
      applyCoupon,
      clearCoupon,
      placeOrder,
      login,
      logout,
      saveProfile: setProfile,
      saveAddress: setAddress,
      notify,
      subtotal,
      count,
    }),
    [
      items,
      favorites,
      orders,
      toast,
      hydrated,
      isAuthenticated,
      profile,
      address,
      couponApplied,
      discount,
      points,
      add,
      change,
      applyCoupon,
      clearCoupon,
      placeOrder,
      login,
      logout,
      notify,
      subtotal,
      count,
    ],
  );
  return (
    <C.Provider value={value}>
      {children}
      {toast && (
        <div className="toast" role="status">
          ✓ {toast}
        </div>
      )}
    </C.Provider>
  );
}
export function useStore() {
  // CUSTOM HOOK
  // Pages call useStore() to access cart, favorites, orders, and user data.
  const value = useContext(C);
  if (!value) throw new Error("StoreProvider is missing");
  return value;
}
export const favProducts = (ids: string[]) =>
  products.filter((p) => ids.includes(p.id));
