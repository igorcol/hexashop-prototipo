"use client"

import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-(--glass-border) bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <span className="text-base font-black tracking-tight text-foreground">
            Hexa<span className="text-verde">Shop</span>
          </span>
        </div>

        {/* Carrinho */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-2 rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-verde hover:text-verde"
        >
          <ShoppingBag size={16} />
          Carrinho
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-verde text-[10px] font-black text-white">
            0
          </span>
        </motion.button>
      </div>
    </motion.header>
  )
}