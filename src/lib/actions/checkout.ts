"use server"


import { revalidatePath } from "next/cache"
import { db } from "../db/db"

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
  console.log("🔥 [ACTION CHECKOUT] Iniciada!");
  console.log("📦 Produto ID:", productId);
  console.log("💰 Preço:", price);
  console.log("📝 Dados do cliente recebidos:", JSON.stringify(formData, null, 2));

  try {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const orderNumber = `HX-${randomNum}`
    console.log("🎫 Gerando pedido:", orderNumber);

    console.log("⏳ Disparando insert no Prisma...");
    
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

    console.log("✅ [SUCESSO] Pedido criado no banco com ID:", order.id);

    revalidatePath("/admin")
    revalidatePath("/admin/pedidos")

    return { success: true, orderId: order.id, orderNumber: order.orderNumber }
  } catch (error) {
    console.error("❌ [ERRO FATAL NO PRISMA]:", error);
    return { success: false, error: "Falha na comunicação com o banco." }
  }
}