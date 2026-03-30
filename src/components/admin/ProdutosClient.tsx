/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { Plus, Pencil, Trash2, X, Package, Loader2 } from "lucide-react"
import { deleteProduct, upsertProduct } from "@/lib/actions/product-actions"


type FormData = {
  name: string
  shortDescription: string
  description: string
  price: string
  originalPrice: string
  category: "acessorio" | "kit" | "vestuario"
  stock: string
  badge: string
  isKit: boolean
  kitItems: string
}

const emptyForm: FormData = {
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "acessorio",
  stock: "",
  badge: "",
  isKit: false,
  kitItems: "",
}


export function ProdutosClient({ initialProducts }: { initialProducts: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>(emptyForm)

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(product: any) {
    setEditing(product)
    setForm({
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: (product.price / 100).toFixed(2),
      originalPrice: (product.originalPrice / 100).toFixed(2),
      category: product.category,
      stock: String(product.stock),
      badge: product.badge ?? "",
      isKit: product.isKit ?? false,
      kitItems: Array.isArray(product.kitItems) ? product.kitItems.join(", ") : (product.kitItems ?? ""),
    })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.stock) return
    setLoading(true)
    
    const res = await upsertProduct(form, editing?.id)
    
    setLoading(false)
    if (res.success) {
      setModalOpen(false)
      setForm(emptyForm)
    } else {
      alert("Erro ao salvar produto.")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return
    const res = await deleteProduct(id)
    if (!res.success) alert("Erro ao excluir produto.")
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-verde">Catálogo</p>
          <h1 className="text-3xl font-black text-foreground">Produtos</h1>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background transition-all hover:bg-verde hover:scale-105 active:scale-95"
        >
          <Plus size={15} />
          Novo Produto
        </button>
      </div>

      {/* Lista Real do Banco */}
      <div className="rounded-2xl border border-(--glass-border) bg-background overflow-hidden shadow-sm">
        <div className="divide-y divide-(--glass-border)">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-foreground-subtle bg-background-secondary/50">
            <span className="col-span-4">Produto</span>
            <span className="col-span-2">Categoria</span>
            <span className="col-span-2">Preço</span>
            <span className="col-span-2">Estoque</span>
            <span className="col-span-2 text-right">Ações</span>
          </div>

          {initialProducts.length === 0 && (
            <div className="p-12 text-center text-foreground-muted">Nenhum produto cadastrado no banco.</div>
          )}

          {initialProducts.map((product) => (
            <div key={product.id} className="grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-background-secondary">
              <div className="col-span-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background-secondary text-xl border border-(--glass-border)">
                  {product.category === "kit" ? "🎯" : product.category === "vestuario" ? "👕" : "⚽"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{product.name}</p>
                  <p className="text-xs text-foreground-subtle truncate max-w-50">{product.shortDescription}</p>
                </div>
              </div>

              <div className="col-span-2">
                <span className="rounded-full border border-(--glass-border) px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                  {product.category}
                </span>
              </div>

              <div className="col-span-2">
                <p className="text-sm font-bold text-foreground">{formatPrice(product.price)}</p>
                <p className="text-xs text-foreground-subtle line-through opacity-50">{formatPrice(product.originalPrice)}</p>
              </div>

              <div className="col-span-2">
                <p className={`text-sm font-semibold ${product.stock < 10 ? 'text-red-400' : 'text-foreground'}`}>
                   {product.stock}
                </p>
                <p className="text-[10px] uppercase font-bold text-foreground-subtle">unidades</p>
              </div>

              <div className="col-span-2 flex justify-end gap-2">
                <button onClick={() => openEdit(product)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-(--glass-border) text-foreground-muted transition-colors hover:bg-background hover:text-verde">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(product.id)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-(--glass-border) text-foreground-muted transition-colors hover:bg-red-500/10 hover:text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lateral (Slide Over) */}
      {modalOpen && (
        <>
          <div onClick={() => !loading && setModalOpen(false)} className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm transition-opacity" />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-(--glass-border) bg-background shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-(--glass-border) px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-verde">{editing ? "Editar" : "Novo"}</p>
                <p className="text-lg font-black text-foreground">{editing ? editing.name : "Cadastrar Produto"}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-background-secondary text-foreground-muted hover:text-foreground">
                <X size={15} />
              </button>
            </div>

            <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 space-y-5 pb-24">
              {/* Inputs */}
              {[
                { name: "name", label: "Nome do Produto", placeholder: "Ex: Kit Resgate do Hexa" },
                { name: "shortDescription", label: "Descrição Curta", placeholder: "Aparece na listagem" },
                { name: "badge", label: "Badge (opcional)", placeholder: "Ex: MAIS VENDIDO" },
              ].map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">{field.label}</label>
                  <input
                    value={form[field.name as keyof FormData] as string}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-verde transition-colors"
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">Descrição Completa</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-verde resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">Preço Venda (R$)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm font-bold text-verde outline-none focus:border-verde" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">Preço Original (R$)</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => setForm((prev) => ({ ...prev, originalPrice: e.target.value }))} className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-verde" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">Categoria</label>
                  <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as any }))} className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm outline-none focus:border-verde">
                    <option value="acessorio">Acessório</option>
                    <option value="kit">Kit</option>
                    <option value="vestuario">Vestuário</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">Estoque</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))} className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm outline-none focus:border-verde" />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-(--glass-border) bg-background-secondary px-4 py-4">
                <input id="isKit" type="checkbox" checked={form.isKit} onChange={(e) => setForm((prev) => ({ ...prev, isKit: e.target.checked }))} className="h-5 w-5 rounded-md accent-verde cursor-pointer" />
                <label htmlFor="isKit" className="text-sm font-bold text-foreground cursor-pointer">Configurar como Kit</label>
              </div>

              {form.isKit && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted flex items-center gap-1.5">
                    <Package size={11} /> Itens (separados por vírgula)
                  </label>
                  <input value={form.kitItems} onChange={(e) => setForm((prev) => ({ ...prev, kitItems: e.target.value }))} placeholder="Ex: Camiseta, Bandeira, Copo" className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm outline-none focus:border-verde" />
                </div>
              )}
            </div>

            <div className="absolute bottom-0 w-full border-t border-(--glass-border) bg-background p-6">
              <button
                onClick={handleSave}
                disabled={loading || !form.name || !form.price}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-sm font-black text-background transition-all hover:bg-verde disabled:opacity-40"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (editing ? "Salvar Alterações" : "Cadastrar Produto")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}