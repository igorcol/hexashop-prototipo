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

/**
 * Cria um pedido pendente associado a um produto real do banco.
 * @param formData Dados do cliente vindos do checkout modal
 * @param productId ID único (CUID/UUID) do produto no banco
 * @param price Preço do produto em centavos (Ex: 8790 para R$ 87,90)
 */
export async function createPendingOrder(formData: CheckoutFormData, productId: string, price: number) {
  console.log("🔥 [ACTION CHECKOUT] Iniciada!");
  console.log("📦 Produto ID:", productId);
  console.log("💰 Preço Recebido:", price);

  try {
    // Gera um número de pedido aleatório único para exibição
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const orderNumber = `HX-${randomNum}`
    
    console.log("⏳ Disparando insert no Prisma...");

    // Cria a Order no SQLite
    const order = await db.order.create({
      data: {
        orderNumber,
        total: price, // Centavos
        status: "pendente",
        
        // Dados do Cliente
        customerName: formData.nome,
        customerCpf: formData.cpf,
        customerPhone: formData.zap,
        customerEmail: formData.email || null,
        
        // Endereço de Entrega
        addressCep: formData.cep,
        addressStreet: formData.rua,
        addressNumber: formData.numero,
        addressComp: formData.complemento || null,
        addressDistrict: formData.bairro,
        addressCity: formData.cidade,
        addressState: formData.estado,
        
        // Associação com o Produto (Chave Estrangeira)
        productId: productId, 
      },
      // Inclui o produto no retorno para logar ou usar se precisar
      include: {
        product: true
      }
    })

    console.log("✅ [SUCESSO] Pedido criado para:", order.product.name);
    console.log("🆔 ID do Pedido no Banco:", order.id);

    // Limpeza de Cache 
    revalidatePath("/admin")
    revalidatePath("/admin/pedidos")
    revalidatePath("/") 
    revalidatePath("/produto/[slug]", "page")

    return { 
      success: true, 
      orderId: order.id, 
      orderNumber: order.orderNumber 
    }

  } catch (error) {
    console.error("❌ [ERRO FATAL NO PRISMA]:", error);
    return { 
      success: false, 
      error: "Falha na comunicação com o banco de dados. Tente novamente." 
    }
  }
}