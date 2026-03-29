import { notFound } from "next/navigation"
import { products } from "@/data/products"
import { ProductPage } from "@/components/shop/ProductPage"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) return {}
  return { title: `${product.name} · HexaShop` }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  return <ProductPage product={product} />
}