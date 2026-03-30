"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"
import { createPendingOrder } from "@/lib/actions/checkout"

interface CheckoutModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

type Step = "form" | "pix" | "success"

type FormData = {
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

const emptyForm: FormData = {
  nome: "",
  cpf: "",
  zap: "",
  email: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
}

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
}

function formatCEP(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2")
}



export function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("form")
  const [loading, setLoading] = useState(false)
  const [fetchingCep, setFetchingCep] = useState(false)
  const [form, setForm] = useState<FormData>(emptyForm)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    let formatted = value

    if (name === "cpf") formatted = formatCPF(value)
    if (name === "zap") formatted = formatPhone(value)
    if (name === "cep") {
      formatted = formatCEP(value)
      if (formatted.replace(/\D/g, "").length === 8) fetchAddress(formatted)
    }

    setForm((prev) => ({ ...prev, [name]: formatted }))
  }

  async function fetchAddress(cep: string) {
    setFetchingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }))
      }
    } catch {
      // silently fail
    } finally {
      setFetchingCep(false)
    }
  }

  async function handleSubmit() {
    const required = [form.nome, form.cpf, form.zap, form.cep, form.rua, form.numero, form.cidade]
    
    // Não envia form vazio
    if (required.some((v) => !v)) {
      console.log("Faltam campos obrigatórios!")
      return
    }
    
    setLoading(true)
    
    // Chama a action
    const result = await createPendingOrder(form, product.id, product.price)
    
    setLoading(false)

    if (result.success) {
      setStep("pix")
    } else {
      console.error(result.error)
      alert("Erro ao processar pedido. Tente novamente.")
    }
  }

  async function handlePixPago() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setStep("success")
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setStep("form")
      setForm(emptyForm)
    }, 400)
  }

  const isFormValid = [
    form.nome, form.cpf, form.zap, form.cep,
    form.rua, form.numero, form.cidade, form.estado
  ].every((v) => v.trim() !== "")

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

            {/* Steps */}
            <div className="max-h-[75vh] overflow-y-auto">
              <div className="p-6">
                <AnimatePresence mode="wait">

                  {/* FORM */}
                  {step === "form" && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      {/* Resumo */}
                      <div className="flex items-center justify-between rounded-2xl bg-background-secondary px-4 py-3">
                        <span className="text-sm text-foreground-muted">Total</span>
                        <span className="text-xl font-black text-verde">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {/* Dados pessoais */}
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-foreground-subtle">
                          Dados Pessoais
                        </p>
                        <div className="space-y-2.5">
                          <Field label="Nome completo" name="nome" placeholder="Igor Colombini" value={form.nome} onChange={handleChange} />
                          <div className="grid grid-cols-2 gap-2.5">
                            <Field label="CPF" name="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} />
                            <Field label="WhatsApp" name="zap" placeholder="(15) 99999-9999" value={form.zap} onChange={handleChange} type="tel" />
                          </div>
                          <Field label="E-mail (opcional)" name="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} type="email" />
                        </div>
                      </div>

                      {/* Endereço */}
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-foreground-subtle">
                          Endereço de Entrega
                        </p>
                        <div className="space-y-2.5">
                          <div className="relative">
                            <Field label="CEP" name="cep" placeholder="00000-000" value={form.cep} onChange={handleChange} />
                            {fetchingCep && (
                              <Loader2 size={12} className="absolute right-3 top-8 animate-spin text-foreground-subtle" />
                            )}
                          </div>

                          <Field label="Rua / Logradouro" name="rua" placeholder="Preenchido pelo CEP" value={form.rua} onChange={handleChange} />

                          <div className="grid grid-cols-2 gap-2.5">
                            <Field label="Número" name="numero" placeholder="123" value={form.numero} onChange={handleChange} />
                            <Field label="Complemento" name="complemento" placeholder="Apto, bloco..." value={form.complemento} onChange={handleChange} />
                          </div>

                          <Field label="Bairro" name="bairro" placeholder="Preenchido pelo CEP" value={form.bairro} onChange={handleChange} />

                          <div className="grid grid-cols-3 gap-2.5">
                            <div className="col-span-2">
                              <Field label="Cidade" name="cidade" placeholder="Sorocaba" value={form.cidade} onChange={handleChange} />
                            </div>
                            <Field label="UF" name="estado" placeholder="SP" value={form.estado} onChange={handleChange} />
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={loading || !isFormValid}
                        className="w-full rounded-2xl bg-verde py-4 text-base font-black text-white disabled:opacity-40 transition-opacity"
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
                        🔒 Seus dados são protegidos e usados apenas para entrega
                      </p>
                    </motion.div>
                  )}

                  {/* PIX */}
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
                        <p className="text-2xl font-black text-foreground">Escaneie o QR Code</p>
                        <p className="text-sm text-foreground-muted">
                          O pedido é confirmado em segundos após o pagamento.
                        </p>
                      </div>

                      <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-(--glass-border) bg-background-secondary">
                        <span className="text-6xl">📱</span>
                      </div>

                      <div className="rounded-2xl bg-background-secondary px-4 py-3">
                        <p className="text-xs text-foreground-muted">Valor a pagar</p>
                        <p className="text-3xl font-black text-verde">{formatPrice(product.price)}</p>
                      </div>

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

                  {/* SUCCESS */}
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

                      <div className="space-y-1">
                        <p className="text-3xl font-black text-foreground">VAI BRASIL!</p>
                        <p className="text-sm text-foreground-muted">
                          Pagamento confirmado, {form.nome.split(" ")[0]}!
                        </p>
                      </div>

                      <div className="rounded-2xl border border-(--glass-border) bg-background-secondary px-4 py-4 text-left space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-verde">
                          Entrega para
                        </p>
                        <p className="text-sm font-semibold text-foreground">{form.nome}</p>
                        <p className="text-xs text-foreground-muted">
                          {form.rua}, {form.numero}{form.complemento ? ` - ${form.complemento}` : ""} · {form.bairro}
                        </p>
                        <p className="text-xs text-foreground-muted">
                          {form.cidade}/{form.estado} · CEP {form.cep}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-(--glass-border) bg-background-secondary px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-verde">Despacho em</p>
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
            </div>
          </motion.div>

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

// Componente auxiliar pra não repetir markup de campo
function Field({
  label, name, placeholder, value, onChange, type = "text"
}: {
  label: string
  name: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle outline-none transition-colors focus:border-verde"
      />
    </div>
  )
}