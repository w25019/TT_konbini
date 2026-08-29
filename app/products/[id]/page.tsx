import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { byId } from "../../../src/data/products";
import DetailClient from "./DetailClient";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = byId(id);
  if (!product) return {};
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const image = `${protocol}://${host}${product.image}`;
  const description = `${product.name}を${product.price}円（税込）でご紹介するTTオンラインコンビニのデモ商品ページです。`;
  return {
    title: `${product.name} | TTオンラインコンビニ`,
    description,
    openGraph: { title: product.name, description, images: [image] },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = byId(id);
  if (!product) notFound();
  return <DetailClient product={product} />;
}
