"use client";

import { AppHeader } from "@/components/app-header";
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { ReceitList } from "@/components/receit-list";
import { ReceitProvider } from "@/lib/receit-context";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function AppContent() {
  return (
    <ReceitProvider>
      <div className="min-h-screen w-full bg-background">
        <AppHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <ReceitList />
          </div>
          <div className="hidden lg:block">
            <DashboardMetrics />
          </div>
        </main>
      </div>
    </ReceitProvider>
  )
}

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="min-h-screen w-full bg-background p-4 sm:px-6">
           <div className="flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 mb-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
              <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                  <div className="space-y-8">
                    <Skeleton className="h-8 w-32 mb-4" />
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                      <Skeleton className="h-64" />
                      <Skeleton className="h-64" />
                    </div>
                  </div>
              </div>
              <div className="hidden lg:block space-y-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-80" />
              </div>
            </div>
        </div>
    );
  }

  return <AppContent />;
}
