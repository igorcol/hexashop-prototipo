import { db } from "@/lib/db/db" 
import { formatPrice } from "@/lib/utils"
import { ShoppingBag, TrendingUp, Clock, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

// Força a página a buscar dados novos a cada refresh
export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // 1. Busca todos os pedidos e traz o nome do produto junto
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true }
  })

  // 2. Cálculos de Negócio (Direto no Servidor)
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelado")
    .reduce((acc, o) => acc + o.total, 0)

  const pendingCount = orders.filter((o) => o.status === "pendente").length
  const deliveredCount = orders.filter((o) => o.status === "entregue").length

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
      value: pendingCount,
      icon: Clock,
      color: "text-amarelo",
      bg: "bg-amarelo/10",
    },
    {
      label: "Entregues",
      value: deliveredCount,
      icon: CheckCircle,
      color: "text-verde",
      bg: "bg-verde/10",
    },
  ]

  // 3. Pegar apenas os 5 mais recentes para a lista
  const recentOrders = orders.slice(0, 5)

  const statusConfig: Record<string, { label: string; classes: string }> = {
    pendente: { label: "Pendente", classes: "bg-amarelo/15 text-amarelo" },
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
        <h1 className="text-4xl font-black tracking-tight text-foreground">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-(--glass-border) bg-background p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} mb-4`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground-subtle">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Inferior */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Pedidos recentes (Ocupa 2 colunas) */}
        <div className="lg:col-span-2 rounded-3xl border border-(--glass-border) bg-background overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-(--glass-border) px-8 py-6">
            <h2 className="text-lg font-black text-foreground">Pedidos Recentes</h2>
            <Link 
              href="/admin/pedidos" 
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-verde transition-colors hover:opacity-70"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-(--glass-border)">
            {recentOrders.length === 0 ? (
              <div className="p-12 text-center text-foreground-muted">Nenhum pedido no banco ainda.</div>
            ) : (
              recentOrders.map((order) => (
                <Link 
                  href={`/admin/pedidos/${order.orderNumber}`}
                  key={order.id} 
                  className="flex items-center justify-between px-8 py-5 transition-colors hover:bg-background-secondary"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background-secondary border border-(--glass-border) text-xs font-black text-foreground-muted">
                      {order.orderNumber.split("-")[1]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-foreground-subtle font-medium">
                        {order.product.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <p className="text-sm font-black text-foreground">
                      {formatPrice(order.total)}
                    </p>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusConfig[order.status].classes}`}>
                      {statusConfig[order.status].label}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sidebar de Dicas ou Logs rápidos */}
        <div className="rounded-3xl border border-(--glass-border) bg-background p-8 space-y-6">
           <h2 className="text-lg font-black text-foreground">Dica do Sistema</h2>
           <div className="rounded-2xl bg-verde/5 border border-verde/20 p-4">
              <p className="text-sm text-foreground-muted leading-relaxed">
                Você tem <span className="font-bold text-verde">{pendingCount}</span> pedidos aguardando despacho. Agilize o envio para manter o termômetro de confiança alto!
              </p>
           </div>
           
           <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">Atalhos Rápidos</p>
              <Link href="/admin/produtos" className="block w-full rounded-xl bg-background-secondary p-3 text-center text-xs font-bold hover:bg-verde hover:text-white transition-colors">
                Gerenciar Estoque
              </Link>
           </div>
        </div>

      </div>
    </div>
  )
}