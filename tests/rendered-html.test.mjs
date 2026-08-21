import assert from"node:assert/strict";
import{access,readFile}from"node:fs/promises";
import test from"node:test";
const root=new URL("../",import.meta.url);
const read=path=>readFile(new URL(path,root),"utf8");

test("creates a deployable Next.js production build",async()=>{await access(new URL(".next/BUILD_ID",root));await access(new URL(".next/server/app/page.js",root))});
test("connects header search and product discovery modes",async()=>{const[layout,list]=await Promise.all([read("src/components/layout.tsx"),read("app/products/ProductsClient.tsx")]);assert.match(layout,/search=\$\{encodeURIComponent\(value\)\}/);assert.match(layout,/products\?popular=1/);assert.match(layout,/href="\/about"/);assert.match(list,/q\.get\("deal"\)/);assert.match(list,/q\.get\("new"\)/);assert.match(list,/q\.get\("popular"\)/);assert.match(list,/PAGE_SIZE=12/);assert.match(list,/selectedBrands/)});
test("keeps coupon, stock, and order totals in shared state",async()=>{const store=await read("src/context/StoreContext.tsx");assert.match(store,/couponApplied/);assert.match(store,/Math\.round\(subtotal\*\.1\)/);assert.match(store,/Math\.min\(product\.stock/);assert.match(store,/setCouponApplied\(false\)/);assert.match(store,/discount:currentDiscount/)});
test("contains no placeholder links or hardcoded obsolete checkout dates",async()=>{const files=["src/components/layout.tsx","src/components/account.tsx","app/mypage/page.tsx","app/login/page.tsx","app/checkout/page.tsx"];for(const file of files){const source=await read(file);assert.doesNotMatch(source,/href=["']#["']/,`${file} contains a placeholder link`);assert.doesNotMatch(source,/2026年8月2[0-2]日/,`${file} contains a hardcoded delivery date`)}});
test("invalid product IDs use the Next.js not-found flow",async()=>{const page=await read("app/products/[id]/page.tsx");assert.match(page,/if\(!product\)notFound\(\)/)});
