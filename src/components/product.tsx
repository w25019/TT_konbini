"use client";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "../data/products";
import { useStore } from "../context/StoreContext";
import { yen } from "./layout";

// PRODUCT IMAGE
export function ProductImage({
  product,
  big = false,
  image,
}: {
  product: Product;
  big?: boolean;
  image?: string;
}) {
  return (
    <div className={big ? "product-image big" : "product-image"}>
      <img src={image || product.image} alt={`${product.name}の商品画像`} />
    </div>
  );
}
export function Rating({ p }: { p: Product }) {
  return (
    <small className="rating">
      <Star fill="currentColor" /> {p.rating} ({p.reviews})
    </small>
  );
}
export function ProductBadges({ p }: { p: Product }) {
  // PRODUCT BADGES
  return (
    <div className="product-badges">
      {p.isNew && <span className="new">NEW</span>}
      {p.isPopular && <span className="popular">人気</span>}
      {p.discount && <span className="sale">{p.discount}% OFF</span>}
    </div>
  );
}
export function ProductPrice({
  p,
  detail = false,
}: {
  p: Product;
  detail?: boolean;
}) {
  // PRODUCT PRICE
  return (
    <div className={detail ? "detail-price price-stack" : "price price-stack"}>
      {p.oldPrice && p.discount ? (
        <small className="old-price">{yen(p.oldPrice)}</small>
      ) : null}
      <strong>{yen(p.price)}</strong>
      <small>（税込）</small>
    </div>
  );
}
export function ProductCard({ p }: { p: Product }) {
  // PRODUCT CARD
  const { add, toggleFavorite, favorites } = useStore();
  const favorite = favorites.includes(p.id);
  return (
    <article className="product-card">
      <ProductBadges p={p} />
      <Link href={`/products/${p.id}`}>
        <ProductImage product={p} />
        <h3>{p.name}</h3>
      </Link>
      <ProductPrice p={p} />
      <Rating p={p} />
      <div className="card-buttons">
        <button
          className={favorite ? "favorite active" : "favorite"}
          onClick={() => toggleFavorite(p.id)}
          aria-label={
            favorite
              ? `${p.name}をお気に入りから削除`
              : `${p.name}をお気に入りに追加`
          }
        >
          <Heart fill={favorite ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => add(p)}
          aria-label={`${p.name}をカートに追加`}
          disabled={p.stock === 0}
        >
          <ShoppingCart />
        </button>
      </div>
      {p.stock === 0 && <small className="out-of-stock">在庫切れ</small>}
    </article>
  );
}
export function Quantity({
  value,
  onChange,
  max = 99,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  // QUANTITY BUTTONS
  return (
    <div className="qty">
      <button
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="数量を減らす"
      >
        −
      </button>
      <span>{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="数量を増やす"
      >
        ＋
      </button>
    </div>
  );
}
