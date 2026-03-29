"use client"

import { motion } from "framer-motion"
import { ShoppingCart, Zap, Package } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  featured?: boolean
  onClick?: (product: Product) => void
}

export function ProductCard({ product, featured = false, onClick }: ProductCardProps) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )
  const stockPercent = Math.round(
    (product.sold / (product.stock + product.sold)) * 100
  )

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => onClick?.(product)}
      className={cn(
        "group relative flex flex-col rounded-lg cursor-pointer overflow-hidden",
        "bg-(--glass-bg) backdrop-blur-sm",
        "border border-(--glass-border)",
        "shadow-(--glass-shadow)",
        "hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]",
        "transition-shadow duration-300",
        featured && "md:col-span-2"
      )}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {product.badge && (
          <span className="flex items-center gap-1 rounded-full bg-amarelo px-3 py-1 text-[11px] font-bold tracking-wide text-black">
            <Zap size={10} />
            {product.badge}
          </span>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10">
        <span className="rounded-full bg-verde px-2.5 py-1 text-[11px] font-bold text-white">
          -{discount}%
        </span>
      </div>

      {/* Área da imagem */}
      <div
        className={cn(
          "relative w-full flex items-center justify-center overflow-hidden",
          "bg-linear-to-br from-background-secondary to-background",
          featured ? "h-72" : "h-52"
        )}
      >
        {/* Círculo de fundo decorativo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500",
              "bg-(--verde-glow)",
              featured ? "w-56 h-56" : "w-36 h-36"
            )}
          />
        </div>

        {/* Emoji placeholder — vai virar <Image /> com foto real */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: featured ? 0 : 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative z-10 select-none"
          style={{ fontSize: featured ? "7rem" : "5rem" }}
        >
          {product.category === "kit" ? "🎯" : "⚽"}
        </motion.div>
      </div>

      {/* Conteúdo */}
      <div className={cn("flex flex-col gap-4 p-6", featured && "p-8")}>

        {/* Nome e descrição */}
        <div className="space-y-1.5">
          <h3
            className={cn(
              "font-bold tracking-tight text-foreground",
              featured ? "text-2xl" : "text-lg"
            )}
          >
            {product.name}
          </h3>
          <p className="text-sm leading-relaxed text-foreground-muted line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        {/* Kit items */}
        {product.isKit && product.kitItems && (
          <div className="flex flex-wrap gap-1.5">
            {product.kitItems.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1 rounded-full border border-(--glass-border) bg-background-secondary px-2.5 py-1 text-[11px] text-foreground-muted"
              >
                <Package size={9} />
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Termômetro */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] text-foreground-subtle">
            <span>🔥 {stockPercent}% reservado do lote</span>
            <span>{product.stock} restantes</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-background-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stockPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full bg-linear-to-r from-verde to-verde-light"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-(--glass-border)" />

        {/* Preço + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-foreground-subtle line-through">
              {formatPrice(product.originalPrice)}
            </p>
            <p
              className={cn(
                "font-black tracking-tight text-verde",
                featured ? "text-3xl" : "text-2xl"
              )}
            >
              {formatPrice(product.price)}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation()
              onClick?.(product)
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl font-semibold text-sm",
              "bg-foreground text-background",
              "px-5 py-3",
              "hover:bg-verde transition-colors duration-200",
              featured && "px-6 py-3.5 text-base"
            )}
          >
            <ShoppingCart size={15} />
            {featured ? "Quero meu Kit" : "Adicionar"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}