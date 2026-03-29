"use client"

import { useState } from "react"
import { products as initialProducts } from "@/data/products"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"
import { Plus, Pencil, Trash2, X, Package } from "lucide-react"

type FormData = {
  name: string
  shortDescription: string
  description: string
  price: string
  originalPrice: string
  category: Product["category"]
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

export default function ProdutosPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(product: Product) {
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
      kitItems: product.kitItems?.join(", ") ?? "",
    })
    setModalOpen(true)
  }

  function handleDelete(id: string) {
    setProductList((prev) => prev.filter((p) => p.id !== id))
  }

  function handleSave() {
    if (!form.name || !form.price || !form.stock) return

    const base = {
      slug: form.name.toLowerCase().replace(/\s+/g, "-"),
      name: form.name,
      shortDescription: form.shortDescription,
      description: form.description,
      price: Math.round(parseFloat(form.price) * 100),
      originalPrice: Math.round(parseFloat(form.originalPrice) * 100),
      category: form.category,
      stock: parseInt(form.stock),
      sold: 0,
      images: ["/images/placeholder.jpg"],
      badge: form.badge || undefined,
      isKit: form.isKit,
      kitItems: form.isKit
        ? form.kitItems.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
    }

    if (editing) {
      setProductList((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...base } : p))
      )
    } else {
      setProductList((prev) => [
        ...prev,
        { ...base, id: String(Date.now()) },
      ])
    }

    setModalOpen(false)
  }

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-verde">
            Catálogo
          </p>
          <h1 className="text-3xl font-black text-foreground">Produtos</h1>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background transition-colors hover:bg-verde"
        >
          <Plus size={15} />
          Novo Produto
        </button>
      </div>

      {/* Lista */}
      <div className="rounded-2xl border border-(--glass-border) bg-background overflow-hidden">
        <div className="divide-y divide-(--glass-border)">

          <div className="grid grid-cols-12 px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-foreground-subtle">
            <span className="col-span-4">Produto</span>
            <span className="col-span-2">Categoria</span>
            <span className="col-span-2">Preço</span>
            <span className="col-span-2">Estoque</span>
            <span className="col-span-2 text-right">Ações</span>
          </div>

          {productList.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-background-secondary"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background-secondary text-xl">
                  {product.category === "kit" ? "🎯" : "⚽"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{product.name}</p>
                  <p className="text-xs text-foreground-subtle">{product.shortDescription}</p>
                </div>
              </div>

              <div className="col-span-2">
                <span className="rounded-full border border-(--glass-border) px-2.5 py-1 text-[11px] font-medium text-foreground-muted capitalize">
                  {product.category}
                </span>
              </div>

              <div className="col-span-2">
                <p className="text-sm font-bold text-foreground">{formatPrice(product.price)}</p>
                <p className="text-xs text-foreground-subtle line-through">{formatPrice(product.originalPrice)}</p>
              </div>

              <div className="col-span-2">
                <p className="text-sm font-semibold text-foreground">{product.stock}</p>
                <p className="text-xs text-foreground-subtle">unidades</p>
              </div>

              <div className="col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => openEdit(product)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-(--glass-border) text-foreground-muted transition-colors hover:border-verde hover:text-verde"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-(--glass-border) text-foreground-muted transition-colors hover:border-red-400 hover:text-red-400"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de cadastro/edição */}
      {modalOpen && (
        <>
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-(--glass-border) bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-(--glass-border) px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-verde">
                  {editing ? "Editar" : "Novo"}
                </p>
                <p className="text-base font-black text-foreground">
                  {editing ? editing.name : "Cadastrar Produto"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-background-secondary text-foreground-muted hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-5 p-6">

              {/* Campos de texto */}
              {[
                { name: "name", label: "Nome do Produto", placeholder: "Ex: Kit Resgate do Hexa" },
                { name: "shortDescription", label: "Descrição Curta", placeholder: "Uma linha" },
                { name: "badge", label: "Badge (opcional)", placeholder: "Ex: MAIS VENDIDO" },
              ].map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    {field.label}
                  </label>
                  <input
                    value={form[field.name as keyof FormData] as string}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-verde"
                  />
                </div>
              ))}

              {/* Descrição longa */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                  Descrição Completa
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Descrição detalhada do produto..."
                  className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-verde resize-none"
                />
              </div>

              {/* Preços */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "price", label: "Preço (R$)" },
                  { name: "originalPrice", label: "Preço Original (R$)" },
                ].map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      value={form[field.name as keyof FormData] as string}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-verde"
                    />
                  </div>
                ))}
              </div>

              {/* Categoria + Estoque */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    Categoria
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as Product["category"] }))}
                    className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-verde"
                  >
                    <option value="acessorio">Acessório</option>
                    <option value="kit">Kit</option>
                    <option value="vestuario">Vestuário</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    Estoque
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                    placeholder="0"
                    className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-verde"
                  />
                </div>
              </div>

              {/* É kit? */}
              <div className="flex items-center gap-3 rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3">
                <input
                  id="isKit"
                  type="checkbox"
                  checked={form.isKit}
                  onChange={(e) => setForm((prev) => ({ ...prev, isKit: e.target.checked }))}
                  className="h-4 w-4 accent-verde"
                />
                <label htmlFor="isKit" className="text-sm font-medium text-foreground cursor-pointer">
                  Este produto é um Kit
                </label>
              </div>

              {/* Kit items */}
              {form.isKit && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted flex items-center gap-1.5">
                    <Package size={11} />
                    Itens do Kit (separados por vírgula)
                  </label>
                  <input
                    value={form.kitItems}
                    onChange={(e) => setForm((prev) => ({ ...prev, kitItems: e.target.value }))}
                    placeholder="Bandeira, Corneta, Trec-trec..."
                    className="w-full rounded-xl border border-(--glass-border) bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-verde"
                  />
                </div>
              )}

              {/* Salvar */}
              <button
                onClick={handleSave}
                disabled={!form.name || !form.price || !form.stock}
                className="w-full rounded-2xl bg-foreground py-4 text-sm font-black text-background transition-colors hover:bg-verde disabled:opacity-40"
              >
                {editing ? "Salvar Alterações" : "Cadastrar Produto"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}