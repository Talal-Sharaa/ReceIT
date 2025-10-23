import { AppHeader } from "@/components/app-header";
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { ReceitList } from "@/components/receit-list";
import { ReceitProvider } from "@/lib/receit-context";

export default function Home() {
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
  );
}
