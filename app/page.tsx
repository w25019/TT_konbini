"use client";

import Link from "next/link";
import { Shell } from "../src/components/layout";
import { ProductCard } from "../src/components/product";
import { categories, products } from "../src/data/products";

export default function Home() {
  const popularProducts = products.filter((product) => product.isPopular).slice(0, 4);

  return (
    <Shell>
      <div className="simple-home">
        <section className="simple-hero">
          <div>
            <p>TT オンラインコンビニ</p>
            <h1>コンビニ商品を<br />かんたんに注文</h1>
            <span>おにぎり、飲み物、お菓子などを販売しているデモサイトです。</span>
            <Link className="primary" href="/products">商品を見る</Link>
          </div>
          <img src="/banners/hero-products-v2.png" alt="コンビニ商品のイメージ" />
        </section>

        <section className="simple-section">
          <h2>カテゴリーから探す</h2>
          <div className="simple-categories">
            {categories.slice(0, 6).map((category) => (
              <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
                {category}
              </Link>
            ))}
          </div>
        </section>

        <section className="simple-section">
          <div className="simple-title">
            <h2>おすすめ商品</h2>
            <Link href="/products">商品一覧へ</Link>
          </div>
          <div className="product-grid simple-product-grid">
            {popularProducts.map((product) => (
              <ProductCard p={product} key={product.id} />
            ))}
          </div>
        </section>

        <section className="simple-notice">
          <h2>このサイトについて</h2>
          <p>学校のポートフォリオとして制作した、オンラインコンビニのデモサイトです。</p>
          <p>実際の注文や決済は行われません。</p>
          <Link href="/about">詳しく見る</Link>
        </section>
      </div>
    </Shell>
  );
}
