"use client";
import Link from "next/link";
import { favProducts, useStore } from "../../src/context/StoreContext";
import { ProductCard } from "../../src/components/product";
import { Shell } from "../../src/components/layout";
export default function Favorites() {
  const s = useStore();
  const ps = favProducts(s.favorites);
  return (
    <Shell>
      <div className="container simple-page">
        <h1>お気に入り商品</h1>
        {ps.length ? (
          <div className="product-grid listing-grid">
            {ps.map((p) => (
              <ProductCard p={p} key={p.id} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>お気に入りはまだありません</h2>
            <p>商品ページのハートボタンから追加できます。</p>
            <Link className="primary" href="/products">
              商品を見る
            </Link>
          </div>
        )}
      </div>
    </Shell>
  );
}
