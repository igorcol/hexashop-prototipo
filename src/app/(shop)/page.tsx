import { ProductGrid } from "@/components/shop/ProductGrid"
import { products } from "@/data/products"

export default function ShopPage() {
  const featured = products.find((p) => p.isKit)!
  const rest = products.filter((p) => !p.isKit)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-20">
        <ProductGrid featured={featured} products={rest} />
      </div>
    </main>
  )
}