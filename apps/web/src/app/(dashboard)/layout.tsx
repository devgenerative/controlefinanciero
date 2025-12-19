import { Sidebar } from "./_components/sidebar";
import { Header } from "./_components/header";

import { AIChatWidget } from "@/components/ai/AIChatWidget"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
        </main>
        <AIChatWidget />
      </div>
    </div>
  )
}
