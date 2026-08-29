"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products } from "../../src/data/products";
import { ProductCard } from "../../src/components/product";
import { Shell } from "../../src/components/layout";
const PAGE_SIZE = 12;

export default function Products() {
  // URL FILTERS
  const q = useSearchParams();
  const queryKey = q.toString();
  const urlCategory = q.get("category") || "すべて";
  const search = (q.get("search") || "").trim();
  const deal = q.get("deal") === "1";
  const isNew = q.get("new") === "1";
  const popular = q.get("popular") === "1";
  // FILTER STATE
  const [cat, setCat] = useState(urlCategory);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(9999);
  const [stock, setStock] = useState(false);
  const [sort, setSort] = useState("おすすめ順");
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  // RESET PAGE
  useEffect(() => {
    setCat(urlCategory);
    setPage(1);
  }, [queryKey, urlCategory]);
  useEffect(
    () => setPage(1),
    [
      cat,
      min,
      max,
      stock,
      sort,
      brandSearch,
      selectedBrands,
      search,
      deal,
      isNew,
      popular,
    ],
  );
  // BRAND LIST
  const brands = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.brand))).sort((a, b) =>
        a.localeCompare(b, "ja"),
      ),
    [],
  );
  const visibleBrands = brands.filter((b) =>
    b.toLocaleLowerCase().includes(brandSearch.trim().toLocaleLowerCase()),
  );
  // FILTER AND SORT
  const filtered = useMemo(() => {
    const term = search.toLocaleLowerCase();
    return products
      .filter(
        (p) =>
          (cat === "すべて" || p.category === cat) &&
          p.price >= min &&
          p.price <= max &&
          (!stock || p.stock > 0) &&
          (!selectedBrands.length || selectedBrands.includes(p.brand)) &&
          (!term ||
            [p.name, p.category, p.brand].some((value) =>
              value.toLocaleLowerCase().includes(term),
            )) &&
          (!deal || (p.discount || 0) > 0) &&
          (!isNew || p.isNew === true) &&
          (!popular || p.isPopular === true),
      )
      .sort((a, b) =>
        sort === "価格が安い順"
          ? a.price - b.price
          : sort === "価格が高い順"
            ? b.price - a.price
            : sort === "人気順"
              ? b.reviews - a.reviews
              : b.rating - a.rating,
      );
  }, [
    cat,
    min,
    max,
    stock,
    selectedBrands,
    search,
    deal,
    isNew,
    popular,
    sort,
  ]);
  // PAGINATION
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const heading = search
    ? `「${search}」の検索結果`
    : deal
      ? "お得な商品"
      : isNew
        ? "新商品"
        : popular
          ? "人気商品"
          : "商品一覧";
  // RESET FILTER
  function reset() {
    setCat("すべて");
    setMin(0);
    setMax(9999);
    setStock(false);
    setSort("おすすめ順");
    setBrandSearch("");
    setSelectedBrands([]);
    setPage(1);
  }
  // BRAND CHECKBOX
  function toggleBrand(brand: string) {
    setSelectedBrands((current) =>
      current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand],
    );
  }
  return (
    <Shell>
      <div className="container">
        <p className="crumb">
          <Link href="/">ホーム</Link>　›　{heading}
        </p>
        <div className="catalog">
          <aside className="filters">
            <div className="filter-head">
              <b>絞り込み</b>
              <button onClick={reset}>リセット</button>
            </div>
            <h4>カテゴリー</h4>
            {categories.map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={cat === c}
                  onChange={() => setCat(cat === c ? "すべて" : c)}
                />
                {c}
              </label>
            ))}
            <h4>価格</h4>
            <div className="range">
              <label>
                <span className="sr-only">最低価格</span>
                <input
                  type="number"
                  value={min || ""}
                  placeholder="¥ 最小"
                  min={0}
                  onChange={(e) => setMin(Math.max(0, +e.target.value || 0))}
                />
              </label>
              <span>〜</span>
              <label>
                <span className="sr-only">最高価格</span>
                <input
                  type="number"
                  value={max === 9999 ? "" : max}
                  placeholder="¥ 最大"
                  min={0}
                  onChange={(e) => setMax(Math.max(0, +e.target.value || 9999))}
                />
              </label>
            </div>
            <div className="quick">
              <button
                onClick={() => {
                  setMin(0);
                  setMax(150);
                }}
              >
                〜¥150
              </button>
              <button
                onClick={() => {
                  setMin(150);
                  setMax(300);
                }}
              >
                ¥150〜¥300
              </button>
              <button
                onClick={() => {
                  setMin(300);
                  setMax(500);
                }}
              >
                ¥300〜¥500
              </button>
            </div>
            <h4>ブランド</h4>
            <input
              className="wide-input"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="ブランドを検索"
              aria-label="ブランドを検索"
            />
            {visibleBrands.map((brand) => (
              <label key={brand}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                {brand}
              </label>
            ))}
            <h4>在庫</h4>
            <label>
              <input
                type="checkbox"
                checked={stock}
                onChange={(e) => setStock(e.target.checked)}
              />{" "}
              在庫ありのみ
            </label>
          </aside>
          <section className="listing">
            <div className="listing-head">
              <h1>
                {heading} <small>全 {filtered.length} 件</small>
              </h1>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="並び順"
              >
                <option>おすすめ順</option>
                <option>価格が安い順</option>
                <option>価格が高い順</option>
                <option>人気順</option>
              </select>
            </div>
            <div className="tabs">
              <button
                className={cat === "すべて" ? "active" : ""}
                onClick={() => setCat("すべて")}
              >
                すべて
              </button>
              {categories.map((c) => (
                <button
                  className={cat === c ? "active" : ""}
                  onClick={() => setCat(c)}
                  key={c}
                >
                  {c}
                </button>
              ))}
            </div>
            {shown.length ? (
              <>
                <div className="product-grid listing-grid">
                  {shown.map((p) => (
                    <ProductCard p={p} key={p.id} />
                  ))}
                </div>
                {pages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={current === 1}
                    >
                      ‹ 前へ
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                      <button
                        className={current === n ? "active" : ""}
                        onClick={() => setPage(n)}
                        key={n}
                        aria-current={current === n ? "page" : undefined}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={current === pages}
                    >
                      次へ ›
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty">
                <h2>
                  {search
                    ? `「${search}」に一致する商品が見つかりませんでした。`
                    : "条件に一致する商品がありません"}
                </h2>
                <p>検索語や絞り込み条件を変更してお試しください。</p>
                {search ? (
                  <Link className="primary" href="/products">
                    検索をリセット
                  </Link>
                ) : (
                  <button className="primary" onClick={reset}>
                    条件をリセット
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </Shell>
  );
}
