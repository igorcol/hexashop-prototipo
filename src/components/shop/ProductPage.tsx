"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, ArrowLeft, Package, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { CheckoutModal } from "@/components/shop/CheckoutModal"
import type { Product } from "@/types/product"

interface ProductPageProps {
  product: Product
}

export function ProductPage({ product }: ProductPageProps) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )
  const stockPercent = Math.round(
    (product.sold / (product.stock + product.sold)) * 100
  )

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-10">

          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Voltar pra vitrine
          </motion.button>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

            {/* Imagem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-(--glass-border) bg-background-secondary"
              style={{ minHeight: "420px" }}
            >
              {product.badge && (
                <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-amarelo px-3 py-1 text-[11px] font-bold text-black">
                  <Zap size={10} />
                  {product.badge}
                </div>
              )}
              <div className="absolute right-4 top-4 z-10 rounded-full bg-verde px-2.5 py-1 text-[11px] font-bold text-white">
                -{discount}%
              </div>
              <div className="absolute h-64 w-64 rounded-full bg-verde/10" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: "10rem" }}
                className="relative z-10 select-none"
              >
                {product.category === "kit" ? "🎯" : "⚽"}
              </motion.div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-verde">
                  {product.category === "kit" ? "Kit Completo" : "Acessório"}
                </p>
                <h1 className="text-4xl font-black tracking-tight text-foreground">
                  {product.name}
                </h1>
                <p className="text-base leading-relaxed text-foreground-muted">
                  {product.description}
                </p>
              </div>

              {product.isKit && product.kitItems && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
                    O que está incluso
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.kitItems.map((item) => (
                      <span
                        key={item}
                        className="flex items-center gap-1.5 rounded-full border border-(--glass-border) bg-background-secondary px-3 py-1.5 text-xs font-medium text-foreground-muted"
                      >
                        <Package size={10} />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-foreground-subtle">
                  <span>🔥 {stockPercent}% do lote reservado</span>
                  <span>{product.stock} restantes</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-background-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stockPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full bg-verde"
                  />
                </div>
              </div>

              <div className="h-px bg-(--glass-border)" />

              <div className="space-y-1">
                <p className="text-sm text-foreground-subtle line-through">
                  {formatPrice(product.originalPrice)}
                </p>
                <p className="text-5xl font-black tracking-tight text-verde">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-foreground-subtle">
                  ou 3x de{" "}
                  <span className="font-semibold text-foreground">
                    {formatPrice(Math.ceil(product.price / 3))}
                  </span>{" "}
                  sem juros
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setModalOpen(true)}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-foreground py-4 text-base font-bold text-background transition-colors hover:bg-verde"
              >
                <ShoppingCart size={18} />
                {product.isKit ? "Quero meu Kit Agora" : "Adicionar ao Carrinho"}
              </motion.button>

              <div className="flex items-center justify-center gap-6 text-xs text-foreground-subtle">
                <span>🔒 Pagamento seguro</span>
                <span>📦 Envio rápido</span>
                <span>✅ Garantia de entrega</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <CheckoutModal
        product={product}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}