"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"

interface CheckoutModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

type Step = "form" | "pix" | "success"

export function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("form")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nome: "", zap: "", cep: "" })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    if (!form.nome || !form.zap || !form.cep) return
    setLoading(true)
    // Simula chamada à API
    await new Promise((r) => setTimeout(r, 1800))
    setLoading(false)
    setStep("pix")
  }

  async function handlePixPago() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setStep("success")
  }

  function handleClose() {
    onClose()
    // Reset com delay pra não ver o estado mudando
    setTimeout(() => {
      setStep("form")
      setForm({ nome: "", zap: "", cep: "" })
    }, 400)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-x-4 bottom-0 z-50 mx-auto max-w-lg overflow-hidden rounded-t-3xl border border-(--glass-border) bg-background shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl"
          >
            {/* Handle mobile */}
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-(--glass-border) md:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-(--glass-border) px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-verde">
                  Checkout Seguro
                </p>
                <p className="text-sm font-bold text-foreground">{product.name}</p>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-background-secondary text-foreground-muted transition-colors hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>

            {/* Conteúdo por step */}
            <div className="p-6">
              <AnimatePresence mode="wait">

                {/* STEP: Form */}
                {step === "form" && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Resumo do pedido */}
                    <div className="flex items-center justify-between rounded-2xl bg-background-secondary px-4 py-3">
                      <span className="text-sm text-foreground-muted">Total</span>
                      <span className="text-xl font-black text-verde">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* Campos */}
                    {[
                      { name: "nome", label: "Seu nome", placeholder: "Como te chamam?", type: "text" },
                      { name: "zap", label: "WhatsApp", placeholder: "(11) 99999-9999", type: "tel" },
                      { name: "cep", label: "CEP", placeholder: "00000-000", type: "text" },
                    ].map((field) => (
                      <div key={field.name} className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                          {field.label}
                        </label>
                        <input
                          name={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={form[field.name as keyof typeof form]}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle outline-none transition-colors focus:border-verde"
                        />
                      </div>
                    ))}

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={loading || !form.nome || !form.zap || !form.cep}
                      className="relative w-full overflow-hidden rounded-2xl py-4 text-base font-black text-white disabled:opacity-50"
                      style={{
                        background: "linear-gradient(90deg, var(--verde), var(--verde-light), var(--verde))",
                        backgroundSize: "200% 100%",
                        animation: loading ? "none" : "shimmer 2s infinite linear",
                      }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Gerando Pix...
                        </span>
                      ) : (
                        "Gerar Pix Agora →"
                      )}
                    </motion.button>

                    <p className="text-center text-[11px] text-foreground-subtle">
                      🔒 Seus dados são protegidos e não serão compartilhados
                    </p>
                  </motion.div>
                )}

                {/* STEP: Pix */}
                {step === "pix" && (
                  <motion.div
                    key="pix"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5 text-center"
                  >
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-foreground">
                        Escaneie o QR Code
                      </p>
                      <p className="text-sm text-foreground-muted">
                        O pedido é confirmado em segundos após o pagamento.
                      </p>
                    </div>

                    {/* QR Code fake */}
                    <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-(--glass-border) bg-background-secondary">
                      <span className="text-6xl">📱</span>
                    </div>

                    {/* Valor */}
                    <div className="rounded-2xl bg-background-secondary px-4 py-3">
                      <p className="text-xs text-foreground-muted">Valor a pagar</p>
                      <p className="text-3xl font-black text-verde">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    {/* Simula confirmação */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePixPago}
                      disabled={loading}
                      className="w-full rounded-2xl bg-foreground py-4 text-base font-black text-background transition-colors hover:bg-verde disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Verificando...
                        </span>
                      ) : (
                        "✅ Simular Pix Pago"
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {/* STEP: Success */}
                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 py-4 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                      className="text-7xl"
                    >
                      🇧🇷
                    </motion.div>

                    <div className="space-y-2">
                      <p className="text-3xl font-black text-foreground">VAI BRASIL!</p>
                      <p className="text-sm text-foreground-muted">
                        Pagamento confirmado, {form.nome.split(" ")[0]}!
                      </p>
                    </div>

                    <div className="rounded-2xl border border-(--glass-border) bg-background-secondary px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-verde">
                        Despacho em
                      </p>
                      <p className="text-2xl font-black text-foreground">15 minutos</p>
                      <p className="mt-1 text-xs text-foreground-subtle">
                        Acompanhe pelo WhatsApp {form.zap}
                      </p>
                    </div>

                    <button
                      onClick={handleClose}
                      className="w-full rounded-2xl border border-(--glass-border) py-3 text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground"
                    >
                      Voltar pra loja
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>

          {/* Animação do shimmer */}
          <style>{`
            @keyframes shimmer {
              0% { background-position: 200% center; }
              100% { background-position: -200% center; }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  )
}