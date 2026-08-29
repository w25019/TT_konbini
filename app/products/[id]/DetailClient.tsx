"use client";
import { useMemo, useState } from "react";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { Product, products } from "../../../src/data/products";
import {
  ProductBadges,
  ProductCard,
  ProductImage,
  ProductPrice,
  Quantity,
  Rating,
} from "../../../src/components/product";
import { Shell } from "../../../src/components/layout";
import { useStore } from "../../../src/context/StoreContext";
export default function DetailClient({ product: p }: { product: Product }) {
  // PRODUCT DETAIL STATE
  // qty is quantity, tab is the selected information tab, and selected is the image.
  const { add, toggleFavorite, favorites, notify } = useStore();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState(0);
  // IMAGE GALLERY
  // Set removes duplicate image URLs before thumbnails are displayed.
  const images = Array.from(new Set([p.image, ...(p.images || [])]));

  // RELATED PRODUCTS
  // First choose the same category, then add popular products.
  const related = useMemo(() => {
    const same = products.filter(
      (x) => x.id !== p.id && x.category === p.category,
    );
    const popular = products.filter(
      (x) => x.id !== p.id && x.isPopular && !same.some((s) => s.id === x.id),
    );
    return [...same, ...popular].slice(0, 5);
  }, [p]);
  // SHARE PRODUCT
  // Use the device share menu when available; otherwise copy the page URL.
  async function share() {
    const data = {
      title: p.name,
      text: p.description,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard.writeText(window.location.href);
    notify("商品URLをコピーしました");
  }
  const favorite = favorites.includes(p.id);
  return (
    <Shell>
      <div className="container">
        <p className="crumb">
          ホーム　›　{p.category}　›　{p.name}
        </p>
        <div className="detail">
          <section className="gallery">
            <ProductImage product={p} big image={images[selected]} />
            {images.length > 1 && (
              <div className="thumbs">
                {images.map((x, i) => (
                  <button
                    key={x}
                    onClick={() => setSelected(i)}
                    className={i === selected ? "selected" : ""}
                    aria-label={`${p.name}の画像${i + 1}を表示`}
                  >
                    <img src={x} alt={`${p.name} 写真 ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </section>
          <section className="product-info">
            <div className="badge">{p.category}</div>
            <button className="share" onClick={share}>
              <Share2 /> シェアする
            </button>
            <ProductBadges p={p} />
            <h1>{p.name}</h1>
            <Rating p={p} />
            <p>{p.description}</p>
            <ProductPrice p={p} detail />
            {p.stock > 0 ? (
              <b className="stock">
                ✓ 在庫あり {p.stock <= 3 && `（残り${p.stock}点）`}
              </b>
            ) : (
              <b className="out-of-stock">在庫切れ</b>
            )}
            <div className="buy-row">
              <div>
                <small>数量</small>
                <Quantity
                  value={qty}
                  max={Math.max(1, p.stock)}
                  onChange={(n) =>
                    setQty(Math.min(Math.max(1, n), Math.max(1, p.stock)))
                  }
                />
              </div>
              <div className="buy-actions">
                <button
                  className="outline"
                  onClick={() => toggleFavorite(p.id)}
                >
                  <Heart fill={favorite ? "currentColor" : "none"} />{" "}
                  {favorite ? "お気に入りから削除" : "お気に入りに追加"}
                </button>
                <button
                  className="primary"
                  onClick={() => add(p, qty)}
                  disabled={p.stock === 0}
                >
                  <ShoppingCart /> {p.stock === 0 ? "在庫切れ" : "カートに追加"}
                </button>
              </div>
            </div>
          </section>
        </div>
        <section className="info-tabs">
          <div>
            {["商品説明", "原材料・アレルゲン", "栄養成分", "配送情報"].map(
              (x, i) => (
                <button
                  className={tab === i ? "active" : ""}
                  onClick={() => setTab(i)}
                  key={x}
                >
                  {x}
                </button>
              ),
            )}
          </div>
          <p>
            {tab === 0
              ? p.description
              : tab === 1
                ? "原材料は商品パッケージをご確認ください。"
                : tab === 2
                  ? "栄養成分表示は商品パッケージをご確認ください。"
                  : "在庫がある商品は最短で当日配送に対応しています。"}
          </p>
        </section>
        <section className="section">
          <h2>一緒に購入されている商品</h2>
          <div className="product-grid related-grid">
            {related.map((x) => (
              <ProductCard p={x} key={x.id} />
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
