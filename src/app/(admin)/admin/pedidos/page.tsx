
import { PedidosClient } from "@/components/admin/PedidosClient"
import { getOrders } from "@/lib/queries/oders"


export const dynamic = "force-dynamic"

export default async function PedidosPage() {
  const orders = await getOrders()

  return <PedidosClient initialOrders={orders} />
}