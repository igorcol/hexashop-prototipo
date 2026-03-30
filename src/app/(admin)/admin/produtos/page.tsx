import { ProdutosClient } from "@/components/admin/ProdutosClient"
import { db } from "@/lib/db/db" 


export const dynamic = "force-dynamic"

export default async function ProdutosPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" }
  })

  // Converte kitItems de string (banco) para array (UI) se necessário
  const formattedProducts = products.map(p => ({
    ...p,
    kitItems: p.kitItems ? p.kitItems.split(",") : []
  }))

  return <ProdutosClient initialProducts={formattedProducts} />
}