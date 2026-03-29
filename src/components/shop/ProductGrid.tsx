"use client"

import { useRouter } from "next/navigation"
import { ProductCard } from "@/components/shop/ProductCard"
import type { Product } from "@/types/product"

interface ProductGridProps {
  featured: Product
  products: Product[]
}

export function ProductGrid({ featured, products }: ProductGridProps) {
  const router = useRouter()

  function handleClick(product: Product) {
    router.push(`/produto/${product.slug}`)
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <ProductCard product={featured} featured onClick={handleClick} />
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={handleClick} />
      ))}
    </div>
  )
}