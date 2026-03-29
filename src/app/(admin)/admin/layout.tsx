import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react"
import Link from "next/link"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background-secondary">

      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-(--glass-border) bg-background px-4 py-6">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="text-lg">🏆</span>
          <div>
            <p className="text-sm font-black text-foreground">
              Hexa<span className="text-verde">Shop</span>
            </p>
            <p className="text-[10px] text-foreground-subtle">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-background-secondary hover:text-foreground"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="mt-auto">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
          >
            <LogOut size={16} />
            Voltar ao site
          </Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

    </div>
  )
}