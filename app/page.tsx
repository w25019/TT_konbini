"use client";

import Link from "next/link";
import { Shell } from "../src/components/layout";
import { ProductCard, ProductImage } from "../src/components/product";
import { categories, products } from "../src/data/products";

export default function Home() {
  const popularProducts = products.filter((product) => product.isPopular).slice(0, 4);
  const categoryProducts = [products[0], products[3], products[6], products[9], products[12], products[15]];

  return (
    <Shell>
      <div className="simple-home">
        <section className="simple-hero">
          <div className="simple-hero-copy">
            <p>毎日の買い物をもっと便利に</p>
            <h1>おうちでかんたん<br />コンビニ注文</h1>
            <span>おにぎり・飲み物・お菓子など、身近な商品をそろえています。</span>
            <div className="simple-hero-buttons">
              <Link className="primary" href="/products">商品を見る</Link>
              <Link className="outline" href="/products?deal=1">セール商品</Link>
            </div>
          </div>
          <img src="/banners/hero-products-v2.png" alt="コンビニ商品のイメージ" />
        </section>

        <div className="simple-benefits">
          <p><b>2,000円以上</b><span>送料無料</span></p>
          <p><b>WELCOME10</b><span>初回10%OFF</span></p>
          <p><b>24時間</b><span>いつでも注文可能</span></p>
        </div>

        <section className="simple-section">
          <h2>カテゴリーから探す</h2>
          <div className="simple-categories">
            {categories.slice(0, 6).map((category) => (
              <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
                <ProductImage product={categoryProducts[categories.indexOf(category)]} />
                <span>{category}</span>
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
          <p>商品検索から注文完了までECサイトの基本的な流れを体験できます。実際の注文や決済は行われません。</p>
          <Link href="/about">詳しく見る</Link>
        </section>
      </div>
    </Shell>
  );
}
