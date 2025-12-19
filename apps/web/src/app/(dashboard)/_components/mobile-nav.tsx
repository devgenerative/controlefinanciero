"use client"

import { LayoutDashboard, ArrowLeftRight, CreditCard, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Transações", icon: ArrowLeftRight, href: "/transactions" },
  { label: "Cartões", icon: CreditCard, href: "/cards" },
  { label: "Menu", icon: Menu, href: "/menu" }, // Placeholder for expanding full menu
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-background border-t h-16 md:hidden z-50 flex items-center justify-around px-4">
      {routes.map((route) => (
        <Link 
          key={route.href} 
          href={route.href}
          className={cn(
            "flex flex-col items-center justify-center space-y-1 text-xs font-medium bg-transparent",
            pathname === route.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          <route.icon className="h-5 w-5" />
          <span>{route.label}</span>
        </Link>
      ))}
    </div>
  );
}
