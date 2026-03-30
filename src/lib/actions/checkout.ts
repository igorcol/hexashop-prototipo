"use server"


import { revalidatePath } from "next/cache"
import { db } from "../db/db"

// Tipagem estrita pra não deixar passar lixo pro banco
export type CheckoutFormData = {
  nome: string
  cpf: string
  zap: string
  email: string
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

export async function createPendingOrder(formData: CheckoutFormData, productId: string, price: number) {
  try {
    const randomNum = Math.floor(1000 + Math.random() * 9000) // Em escala usar nanoid ou sequence.
    const orderNumber = `HX-${randomNum}`

    const order = await db.order.create({
      data: {
        orderNumber,
        total: price,
        status: "pendente",
        
        customerName: formData.nome,
        customerCpf: formData.cpf,
        customerPhone: formData.zap,
        customerEmail: formData.email || null,
        
        addressCep: formData.cep,
        addressStreet: formData.rua,
        addressNumber: formData.numero,
        addressComp: formData.complemento || null,
        addressDistrict: formData.bairro,
        addressCity: formData.cidade,
        addressState: formData.estado,
        
        productId: productId,
      }
    })

    revalidatePath("/admin")
    revalidatePath("/admin/pedidos")

    return { success: true, orderId: order.id, orderNumber: order.orderNumber }
  } catch (error) {
    console.error("Erro fatal no checkout:", error)
    return { success: false, error: "Falha na comunicação com o banco." }
  }
}