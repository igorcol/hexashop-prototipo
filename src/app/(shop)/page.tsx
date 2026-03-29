import { products } from "@/data/products"
import { ProductCard } from "@/components/shop/ProductCard"

export default function ShopPage() {
  const featured = products.find((p) => p.isKit)!
  const rest = products.filter((p) => !p.isKit)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-20">

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ProductCard product={featured} featured />
          {rest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </main>
  )
}