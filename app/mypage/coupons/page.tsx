"use client";import{AccountGuard,AccountPage}from"../../../src/components/account";import{Shell}from"../../../src/components/layout";
export default function Coupons(){return <Shell><AccountGuard><AccountPage title="クーポン"><article className="coupon-ticket"><b>初回注文10%OFF</b><code>WELCOME10</code><p>商品小計から10%割引されるポートフォリオ用デモクーポンです。カート画面で入力してください。</p></article></AccountPage></AccountGuard></Shell>}
