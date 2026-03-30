"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { Search, Phone, MapPin } from "lucide-react"
import { OrderStatus, UIOrder } from "@/lib/queries/oders"


const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
  pendente: { label: "Pendente", classes: "bg-amarelo/15 text-amarelo" },
  enviado: { label: "Enviado", classes: "bg-blue-100 text-blue-600" },
  entregue: { label: "Entregue", classes: "bg-verde/10 text-verde" },
  cancelado: { label: "Cancelado", classes: "bg-red-100 text-red-500" },
}

const filters: { label: string; value: OrderStatus | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Pendentes", value: "pendente" },
  { label: "Enviados", value: "enviado" },
  { label: "Entregues", value: "entregue" },
  { label: "Cancelados", value: "cancelado" },
]

export function PedidosClient({ initialOrders }: { initialOrders: UIOrder[] }) {
  const [filter, setFilter] = useState<OrderStatus | "todos">("todos")
  const [search, setSearch] = useState("")

  const filtered = initialOrders.filter((o) => {
    const matchStatus = filter === "todos" || o.status === filter
    const matchSearch =
      o.customer.nome.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-verde">Gestão</p>
        <h1 className="text-3xl font-black text-foreground">Pedidos</h1>
      </div>

      {/* Filtros + Busca */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                filter === f.value
                  ? "bg-foreground text-background"
                  : "bg-background border border-(--glass-border) text-foreground-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle" />
          <input
            placeholder="Buscar pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-(--glass-border) bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-verde sm:w-56"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-2xl border border-(--glass-border) bg-background overflow-hidden">
        <div className="divide-y divide-(--glass-border)">
          {/* Header da tabela */}
          <div className="grid grid-cols-12 px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-foreground-subtle">
            <span className="col-span-1">#</span>
            <span className="col-span-3">Cliente</span>
            <span className="col-span-3">Produto</span>
            <span className="col-span-2">Data</span>
            <span className="col-span-1 text-right">Total</span>
            <span className="col-span-2 text-right">Status</span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-foreground-subtle">
              Nenhum pedido encontrado.
            </div>
          ) : (
            filtered.map((order) => (
              <div key={order.id} className="grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-background-secondary">
                <span className="col-span-1 text-xs font-black text-foreground-muted">{order.id}</span>
                <div className="col-span-3 space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">{order.customer.nome}</p>
                  <div className="flex items-center gap-3 text-[11px] text-foreground-subtle">
                    <span className="flex items-center gap-1"><Phone size={10} />{order.customer.zap}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} />{order.customer.cep}</span>
                  </div>
                </div>
                <span className="col-span-3 text-sm text-foreground-muted">{order.product}</span>
                <span className="col-span-2 text-xs text-foreground-subtle">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </span>
                <span className="col-span-1 text-right text-sm font-bold text-foreground">
                  {formatPrice(order.total)}
                </span>
                <div className="col-span-2 flex justify-end">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusConfig[order.status].classes}`}>
                    {statusConfig[order.status].label}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}