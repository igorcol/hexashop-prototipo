"use server";

import { db } from "../db/db";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertProduct(data: any, id?: string) {
  try {
    const payload = {
      name: data.name,
      slug: data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // Limpa tudo que não é letra, número ou espaço
        .replace(/\s+/g, "-") // Troca espaços por -
        .replace(/-+/g, "-"), // Remove hifens duplos
      shortDescription: data.shortDescription,
      description: data.description,
      price: Math.round(parseFloat(data.price) * 100),
      originalPrice: Math.round(parseFloat(data.originalPrice) * 100),
      category: data.category,
      stock: parseInt(data.stock),
      badge: data.badge || null,
      isKit: data.isKit,
      kitItems: data.kitItems,
      images: "/images/placeholder.jpg",
    };

    if (id) {
      await db.product.update({ where: { id }, data: payload });
    } else {
      await db.product.create({ data: payload });
    }

    revalidatePath("/admin/produtos");
    revalidatePath("/"); // Revalida a home para mostrar o produto novo
    return { success: true };
  } catch (error) {
    console.error("Erro no upsert:", error);
    return { success: false };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/admin/produtos");
    return { success: true };
  } catch {
    return { success: false };
  }
}
