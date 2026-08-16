import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container">商品を読み込んでいます...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
