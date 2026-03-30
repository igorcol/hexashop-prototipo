import { db } from "../db/db"


export type OrderStatus = "pendente" | "enviado" | "entregue" | "cancelado"

export async function getOrders() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  })

  // Mapeia do formato do Prisma (Achatado) para o formato do seu UI (Aninhado)
  return orders.map((o) => ({
    id: o.orderNumber, // O visual bonito: HX-1407
    dbId: o.id,        // O ID real do banco (vamos precisar dele pra mudar o status depois)
    customer: {
      nome: o.customerName,
      zap: o.customerPhone,
      cep: o.addressCep,
    },
    product: o.product.name,
    total: o.total,
    status: o.status as OrderStatus,
    createdAt: o.createdAt.toISOString(),
  }))
}

export type UIOrder = Awaited<ReturnType<typeof getOrders>>[number]