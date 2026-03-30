"use client"

import { useState } from "react"

import { Loader2, CheckCircle2 } from "lucide-react"
import { dispatchOrder } from "@/lib/actions/order-actions"

export function DispatchForm({ dbId, status }: { dbId: string, status: string }) {
  const [loading, setLoading] = useState(false)
  const [tracking, setTracking] = useState("")

  async function handleDispatch() {
    setLoading(true)
    // Chama a nossa Server Action passando o ID real do banco e o código
    const res = await dispatchOrder(dbId, tracking)
    setLoading(false)

    if (!res.success) {
      alert(res.error)
    }
  }

  if (status !== "pendente") {
    return (
      <div className="rounded-2xl border border-(--glass-border) bg-verde/10 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-2 text-verde" size={32} />
        <p className="font-bold text-verde">Pedido Despachado</p>
        <p className="text-xs text-foreground-muted mt-1">O cliente já foi notificado.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-(--glass-border) bg-background p-6 space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-widest text-foreground-subtle">Despachar Pedido</h2>
      
      <div className="space-y-1">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
          Código de Rastreio (Opcional)
        </label>
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Ex: BR123456789BR"
          className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-2.5 text-sm text-foreground outline-none focus:border-verde"
        />
      </div>

      <button
        onClick={handleDispatch}
        disabled={loading}
        className="w-full rounded-xl bg-foreground py-3 text-sm font-bold text-background transition-colors hover:bg-verde disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Atualizando...
          </span>
        ) : (
          "Confirmar e Enviar"
        )}
      </button>
    </div>
  )
}