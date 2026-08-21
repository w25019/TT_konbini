"use client";
import Link from"next/link";
import{usePathname,useRouter}from"next/navigation";
import{Menu,Search,MapPin,User,ShoppingCart,Home,Grid2X2,Tag,Gift,Star,CircleHelp,X}from"lucide-react";
import{FormEvent,KeyboardEvent,useEffect,useState}from"react";
import{useStore}from"../context/StoreContext";

export const yen=(n:number)=>`¥${Math.round(n).toLocaleString("ja-JP")}`;
export function Logo(){return <Link href="/" className="logo"><b>TT</b><span><strong>TT オンラインコンビニ</strong><small>毎日の便利を、もっと身近に。</small></span></Link>}

export function Header(){
 const s=useStore();const[open,setOpen]=useState(false);const[search,setSearch]=useState("");const router=useRouter();const pathname=usePathname();
 useEffect(()=>setOpen(false),[pathname]);
 const links=[["/","ホーム",Home],["/products","カテゴリー",Grid2X2],["/products?deal=1","お得",Tag],["/products?new=1","新商品",Gift],["/products?popular=1","人気商品",Star],["/about","TTについて",CircleHelp]]as const;
 function go(){const value=search.trim();router.push(value?`/products?search=${encodeURIComponent(value)}`:"/products");setOpen(false)}
 function submit(e:FormEvent){e.preventDefault();go()}
 function keyDown(e:KeyboardEvent<HTMLInputElement>){if(e.key==="Enter"){e.preventDefault();go()}}
 return <header><div className="topbar"><Logo/><form className="search" onSubmit={submit}><input aria-label="商品検索" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={keyDown} placeholder="商品名・カテゴリー・ブランドを検索"/><button aria-label="検索" type="submit"><Search/></button></form><div className="head-actions"><div><MapPin/><small>お届け先</small><b>{s.address?`${s.address.prefecture}${s.address.city}`:"未登録"}</b></div><Link href={s.isAuthenticated?"/mypage":"/login"}><User/><small>{s.isAuthenticated?"アカウント":"ログイン"}</small><b>{s.isAuthenticated?"マイページ":"ログイン"}</b></Link><Link href="/cart" className="cart"><ShoppingCart/><i>{s.count}</i><small>カート</small><b>{yen(s.subtotal)}</b></Link></div><button className="hamb" onClick={()=>setOpen(!open)} aria-label="メニュー" aria-expanded={open}>{open?<X/>:<Menu/>}</button></div><nav className={open?"open":""}>{links.map(([href,label,I])=><Link href={href} key={label}><I/>{label}</Link>)}</nav></header>
}
export function Footer(){return <footer><div className="benefits"><span>🚚 <b>最短当日お届け</b></span><span>🛡️ <b>安心・安全なお支払い</b></span><span>🎁 <b>お得な会員特典</b></span><span>🎧 <b>デモサポート</b></span></div><div className="footer-main"><Logo/><nav className="footer-links"><Link href="/guide">お買い物ガイド</Link><Link href="/about">会社情報</Link><Link href="/help">ヘルプ・サポート</Link></nav><small>© 2026 TT Online Convenience Store — Portfolio Demo</small></div></footer>}
export function Shell({children}:{children:React.ReactNode}){return <><Header/><main>{children}</main><Footer/></>}
