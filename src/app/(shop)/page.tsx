/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db/db"
import { ProductGrid } from "@/components/shop/ProductGrid"

export const dynamic = "force-dynamic"

export default async function ShopPage() {
  const allProducts = await db.product.findMany({
    orderBy: { createdAt: "desc" }
  })

  // Mapeamento para alinhar o Schema do Prisma com o Type 'Product' da UI
  const formattedProducts = allProducts.map(p => ({
    ...p,
    images: p.images ? [p.images] : ["/images/placeholder.jpg"],
    kitItems: p.kitItems ? p.kitItems.split(",") : [],
    category: p.category as any // Bypass de enum se necessário
  }))

  // Produto destaque
  const featured = formattedProducts.find((p) => p.isKit) || formattedProducts[0]
  // Restante dos produtos sem o destaque
  const rest = formattedProducts.filter((p) => p.id !== featured?.id)

  if (!featured) {
    return <div className="p-20 text-center">Catálogo vazio...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-20">
        <ProductGrid featured={featured as any} products={rest as any} />
      </div>
    </main>
  )
}