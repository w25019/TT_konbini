"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";

// PRICE FORMAT
export const yen = (number: number) =>
  `¥${Math.round(number).toLocaleString("ja-JP")}`;

export function Logo() {
  return (
    <Link href="/" className="logo simple-logo">
      <b>TT</b>
      <span>
        <strong>TT オンラインコンビニ</strong>
        <small>学生ポートフォリオ</small>
      </span>
    </Link>
  );
}

export function Header() {
  // HEADER STATE
  const store = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  // CLOSE MOBILE MENU
  useEffect(() => setMenuOpen(false), [pathname]);

  // PRODUCT SEARCH
  function searchProducts(event: FormEvent) {
    event.preventDefault();
    const value = search.trim();
    router.push(
      value ? `/products?search=${encodeURIComponent(value)}` : "/products",
    );
  }

  return (
    <header className="simple-header">
      <div className="simple-header-row">
        <Logo />
        <form className="simple-search" onSubmit={searchProducts}>
          <input
            aria-label="商品検索"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="商品を検索"
          />
          <button aria-label="検索" type="submit">
            <Search />
          </button>
        </form>
        <div className="simple-actions">
          <Link href={store.isAuthenticated ? "/mypage" : "/login"}>
            {store.isAuthenticated ? "マイページ" : "ログイン"}
          </Link>
          <Link href="/cart" className="simple-cart">
            <ShoppingCart /> カート ({store.count})
          </Link>
        </div>
        <button
          className="hamb"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <nav className={menuOpen ? "simple-nav open" : "simple-nav"}>
        <Link href="/">ホーム</Link>
        <Link href="/products">商品一覧</Link>
        <Link href="/products?deal=1">セール</Link>
        <Link href="/products?popular=1">人気商品</Link>
        <Link href="/favorites">お気に入り</Link>
        <Link href="/about">このサイトについて</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="simple-footer">
      <p>
        <b>TT オンラインコンビニ</b>　学生ポートフォリオ用デモサイト
      </p>
      <div>
        <Link href="/guide">ご利用ガイド</Link>
        <Link href="/about">このサイトについて</Link>
        <Link href="/help">ヘルプ</Link>
      </div>
      <small>© 2026 TT Online Konbini</small>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  // PAGE LAYOUT
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
