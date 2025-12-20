"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./_components/sidebar";
import { Header } from "./_components/header";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect if hydration is complete AND user is NOT authenticated
    if (isMounted && _hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isMounted, _hasHydrated, isAuthenticated, router]);

  // Show loading/spinner if:
  // 1. Component hasn't mounted yet (hydration check)
  // 2. hydration hasn't finished (_hasHydrated is false)
  // 3. User is not authenticated (waiting for redirect)
  if (!isMounted || !_hasHydrated || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

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
  );
}
