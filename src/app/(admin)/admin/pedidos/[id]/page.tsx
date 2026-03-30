import { db } from "@/lib/db/db"
import { notFound } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { DispatchForm } from "./DispatchForm"
import { ArrowLeft, Package, User, MapPin, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PedidoDetailsPage({ params }: { params: { id: string } }) {
  const order = await db.order.findFirst({
    where: { orderNumber: params.id },
    include: { product: true }
  })

  if (!order) return notFound()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header com Navegação */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Link 
              href="/admin/pedidos" 
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground-muted transition-colors hover:text-verde"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Voltar aos pedidos
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {order.orderNumber}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 rounded-2xl border border-(--glass-border) bg-background-secondary px-4 py-2">
            <Calendar size={16} className="text-verde" />
            <span className="text-sm font-bold text-foreground">
              {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* COLUNA PRINCIPAL (ESQUERDA) */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Card do Produto */}
            <div className="relative overflow-hidden rounded-3xl border border-(--glass-border) bg-background shadow-sm">
              <div className="absolute top-0 left-0 h-1 w-full bg-verde" />
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-background-secondary border border-(--glass-border)">
                      <Package size={40} className="text-foreground-subtle" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-verde">Item do Pedido</p>
                      <h3 className="text-2xl font-black text-foreground">{order.product.name}</h3>
                      <p className="text-sm text-foreground-muted">SKU: {order.product.slug.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle">Total</p>
                    <p className="text-3xl font-black text-foreground">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Dados */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Cliente */}
              <div className="rounded-3xl border border-(--glass-border) bg-background p-8 space-y-4">
                <div className="flex items-center gap-3 text-verde">
                  <User size={18} />
                  <h4 className="text-sm font-bold uppercase tracking-widest">Cliente</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-foreground-muted">Nome Completo</p>
                    <p className="font-bold text-foreground">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted">Documento (CPF)</p>
                    <p className="font-medium text-foreground">{order.customerCpf}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                     <div className="rounded-xl bg-background-secondary p-3 border border-(--glass-border)">
                        <p className="text-[10px] uppercase font-bold text-foreground-subtle mb-1">Contato</p>
                        <p className="text-sm font-bold">{order.customerPhone}</p>
                        <p className="text-xs text-foreground-muted">{order.customerEmail || "Sem e-mail"}</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Entrega */}
              <div className="rounded-3xl border border-(--glass-border) bg-background p-8 space-y-4">
                <div className="flex items-center gap-3 text-verde">
                  <MapPin size={18} />
                  <h4 className="text-sm font-bold uppercase tracking-widest">Entrega</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-foreground-muted">Logradouro</p>
                    <p className="font-bold text-foreground">
                      {order.addressStreet}, {order.addressNumber}
                    </p>
                    {order.addressComp && (
                      <p className="text-sm text-foreground-muted italic">{order.addressComp}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-foreground-muted">Bairro</p>
                      <p className="font-semibold text-foreground">{order.addressDistrict}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">Cidade/UF</p>
                      <p className="font-semibold text-foreground">{order.addressCity} / {order.addressState}</p>
                    </div>
                  </div>
                  <div className="inline-block rounded-lg bg-foreground/3 px-3 py-1 border border-(--glass-border)">
                    <p className="text-xs font-bold text-foreground">CEP: {order.addressCep}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR (DIREITA) */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-(--glass-border) bg-background p-8 shadow-sm">
              <div className="flex items-center gap-3 text-verde mb-6">
                <CreditCard size={18} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Pagamento</h4>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-muted">Subtotal</span>
                  <span className="font-bold">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-muted">Frete</span>
                  <span className="text-sm font-bold text-verde">GRÁTIS</span>
                </div>
                <div className="h-px bg-(--glass-border)" />
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold">Total Recebido</span>
                  <span className="text-2xl font-black text-verde">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Status e Ação de Despacho */}
            <DispatchForm dbId={order.id} status={order.status} />
            
            <div className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-subtle">
                HexaShop Logistics v1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}