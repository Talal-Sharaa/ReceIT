"use client";

import { useReceits } from "@/lib/receit-context";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DoneTodoRatio } from "./done-todo-ratio";
import { CategoryBreakdownChart } from "./category-breakdown-chart";
import { PieChart, Activity } from "lucide-react";

export function DashboardMetrics() {
  const { receits } = useReceits();

  if (receits.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">No data available. Add some ReceITs to see your stats.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="sticky top-20 space-y-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Done / To-Do Ratio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <DoneTodoRatio />
        </CardContent>
       </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Completed by Category</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <CategoryBreakdownChart />
        </CardContent>
       </Card>
    </div>
  );
}
