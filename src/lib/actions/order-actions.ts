"use server"


import { revalidatePath } from "next/cache"
import { db } from "../db/db"

export async function dispatchOrder(dbId: string, trackingCode: string) {
  try {
    await db.order.update({
      where: { id: dbId },
      data: {
        status: "enviado",
      }
    })

    revalidatePath("/admin/pedidos")
    revalidatePath(`/admin/pedidos/[id]`, "page")

    return { success: true }
  } catch (error) {
    console.error("Erro ao despachar pedido:", error)
    return { success: false, error: "Erro ao atualizar o banco de dados." }
  }
}