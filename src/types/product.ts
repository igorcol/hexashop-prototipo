export type ProductCategory = "kit" | "acessorio" | "vestuario"

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  shortDescription: string
  price: number
  originalPrice: number
  images: string[]
  category: ProductCategory
  badge?: string
  isKit?: boolean
  kitItems?: string[]
  stock: number
  sold: number
}