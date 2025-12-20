"use client"

import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  CreditCard, 
  Target, 
  PiggyBank, 
  FileWarning, 
  BarChart3, 
  Settings,
  Menu,
  CalendarDays,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", color: "text-sky-500" },
  { label: "Contas", icon: Wallet, href: "/accounts", color: "text-purple-500" },
  { label: "Transações", icon: ArrowLeftRight, href: "/transactions", color: "text-violet-500" },
  { label: "Contas Fixas", icon: CalendarDays, href: "/bills", color: "text-blue-500" },
  { label: "Cartões", icon: CreditCard, href: "/cards", color: "text-pink-700" },
  { label: "Metas", icon: Target, href: "/goals", color: "text-orange-700" },
  { label: "Reservas", icon: PiggyBank, href: "/reserves", color: "text-emerald-500" },
  { label: "Dívidas", icon: FileWarning, href: "/debts", color: "text-red-700" },
  { label: "Relatórios", icon: BarChart3, href: "/reports", color: "text-green-700" },
];

const settingsRoute = { label: "Configurações", icon: Settings, href: "/settings" };

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col h-full bg-slate-900 text-white transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center p-4 h-16 shrink-0">
          {!collapsed && <h1 className="text-xl font-bold text-white whitespace-nowrap">Financeira</h1>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)} 
            className={cn("ml-auto text-white hover:bg-white/10", !collapsed && "ml-auto")}
          >
            <Menu className="h-5 w-5" />
          </Button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <div className="flex flex-col space-y-1 px-3">
          {routes.map((route) => (
            <Link 
              key={route.href} 
              href={route.href}
              className={cn(
                "flex items-center p-3 w-full rounded-lg transition hover:bg-white/10",
                pathname === route.href ? "bg-white/10 text-white" : "text-zinc-400",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <route.icon className={cn("h-5 w-5", route.color)} />
              {!collapsed && (
                <div className="ml-3 flex-1 text-sm font-medium">
                  {route.label}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
      {/* Settings fixed at bottom */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <Link 
          href={settingsRoute.href}
          className={cn(
            "flex items-center p-3 w-full rounded-lg transition hover:bg-white/10",
            pathname === settingsRoute.href ? "bg-white/10 text-white" : "text-zinc-400",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <settingsRoute.icon className="h-5 w-5" />
          {!collapsed && (
            <div className="ml-3 flex-1 text-sm font-medium">
              {settingsRoute.label}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
