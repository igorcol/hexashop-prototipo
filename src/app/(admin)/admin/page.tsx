import { orders } from "@/data/orders"
import { formatPrice } from "@/lib/utils"
import { ShoppingBag, TrendingUp, Clock, CheckCircle } from "lucide-react"

export default function AdminPage() {
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelado")
    .reduce((acc, o) => acc + o.total, 0)

  const stats = [
    {
      label: "Receita Total",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: "text-verde",
      bg: "bg-verde/10",
    },
    {
      label: "Total de Pedidos",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-foreground",
      bg: "bg-background-secondary",
    },
    {
      label: "Pendentes",
      value: orders.filter((o) => o.status === "pendente").length,
      icon: Clock,
      color: "text-amarelo",
      bg: "bg-amarelo/10",
    },
    {
      label: "Entregues",
      value: orders.filter((o) => o.status === "entregue").length,
      icon: CheckCircle,
      color: "text-verde",
      bg: "bg-verde/10",
    },
  ]

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const statusConfig: Record<string, { label: string; classes: string }> = {
    pendente: { label: "Pendente", classes: "bg-amarelo/15 text-amarelo-light" },
    enviado: { label: "Enviado", classes: "bg-blue-100 text-blue-600" },
    entregue: { label: "Entregue", classes: "bg-verde/10 text-verde" },
    cancelado: { label: "Cancelado", classes: "bg-red-100 text-red-500" },
  }

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-verde">
          Visão Geral
        </p>
        <h1 className="text-3xl font-black text-foreground">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-(--glass-border) bg-background p-5 space-y-3"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon size={16} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs text-foreground-subtle">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pedidos recentes */}
      <div className="rounded-2xl border border-(--glass-border) bg-background">
        <div className="flex items-center justify-between border-b border-(--glass-border) px-6 py-4">
          <h2 className="text-sm font-bold text-foreground">Pedidos Recentes</h2>
          <a href="/admin/pedidos" className="text-xs font-semibold text-verde hover:underline">
            Ver todos →
          </a>
        </div>

        <div className="divide-y divide-(--glass-border)">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background-secondary text-sm font-black text-foreground-muted">
                  {order.id.split("-")[1]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {order.customer.nome}
                  </p>
                  <p className="text-xs text-foreground-subtle">{order.product}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm font-bold text-foreground">
                  {formatPrice(order.total)}
                </p>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusConfig[order.status].classes}`}>
                  {statusConfig[order.status].label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}