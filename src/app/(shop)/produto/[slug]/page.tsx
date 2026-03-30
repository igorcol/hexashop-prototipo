import { db } from "@/lib/db/db"
import { notFound } from "next/navigation"
import { ProductPage } from "@/components/shop/ProductPage"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Metadata Dinâmica buscando do Banco
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const product = await db.product.findFirst({
    where: { slug }
  })
  
  if (!product) return { title: "Produto não encontrado" }
  return { title: `${product.name} · HexaShop` }
}


export default async function Page({ params }: PageProps) {
  const { slug } = await params
  
  // Busca o produto no SQLite
  const product = await db.product.findFirst({
    where: { slug }
  })

  if (!product) notFound()

  // Formata os dados para o componente (ex: kitItems de string para array)
  const formattedProduct = {
    ...product,
    // Converte null em undefined para satisfazer o Type 'Product'
    badge: product.badge ?? undefined,
    // Garante que images seja um Array
    images: product.images ? [product.images] : ["/images/placeholder.jpg"],
    // Transforma a string do banco em Array de itens
    kitItems: product.kitItems ? product.kitItems.split(",") : [],
    // Força o tipo da categoria
    category: product.category as "kit" | "acessorio" | "vestuario"
  }

  return <ProductPage product={formattedProduct} />
}

// pré-renderiza os produtos que já existem
export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } })
  return products.map((p) => ({ slug: p.slug }))
}