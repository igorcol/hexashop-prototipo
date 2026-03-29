export type OrderStatus = "pendente" | "enviado" | "entregue" | "cancelado"

export type Order = {
  id: string
  customer: {
    nome: string
    zap: string
    cep: string
  }
  product: string
  total: number
  status: OrderStatus
  createdAt: string
}

export const orders: Order[] = [
  {
    id: "HX-001",
    customer: { nome: "Carlos Souza", zap: "11991234567", cep: "01310-100" },
    product: "Kit Resgate do Hexa",
    total: 8790,
    status: "entregue",
    createdAt: "2026-03-20T10:30:00",
  },
  {
    id: "HX-002",
    customer: { nome: "Ana Lima", zap: "21987654321", cep: "20040-020" },
    product: "Kit Resgate do Hexa",
    total: 8790,
    status: "enviado",
    createdAt: "2026-03-21T14:15:00",
  },
  {
    id: "HX-003",
    customer: { nome: "Pedro Alves", zap: "31999887766", cep: "30112-000" },
    product: "Bandeira de Janela",
    total: 1990,
    status: "pendente",
    createdAt: "2026-03-22T09:00:00",
  },
  {
    id: "HX-004",
    customer: { nome: "Julia Costa", zap: "85988776655", cep: "60135-180" },
    product: "Corneta de Ar",
    total: 2490,
    status: "pendente",
    createdAt: "2026-03-22T11:45:00",
  },
  {
    id: "HX-005",
    customer: { nome: "Marcos Ferreira", zap: "51977665544", cep: "90010-280" },
    product: "Kit Resgate do Hexa",
    total: 8790,
    status: "cancelado",
    createdAt: "2026-03-19T16:20:00",
  },
]