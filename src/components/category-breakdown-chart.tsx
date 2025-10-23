"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useReceits } from "@/lib/receit-context"

export function CategoryBreakdownChart() {
  const { receits } = useReceits();

  const completedReceits = receits.filter(r => r.status === 'Done');
  
  const data = React.useMemo(() => {
    const categoryCounts = completedReceits.reduce((acc, receit) => {
        acc[receit.category] = (acc[receit.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
      fill: `var(--color-${name.toLowerCase().replace(/\s+/g, '-')})`,
    }));
  }, [completedReceits]);

  const chartConfig = React.useMemo(() => {
    const config: any = {};
    data.forEach((item, index) => {
      config[item.name.toLowerCase().replace(/\s+/g, '-')] = {
        label: item.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return config;
  }, [data]);


  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-10">No completed tasks to display.</p>
  }
  
  return (
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[300px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
          >
            {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
        </PieChart>
      </ChartContainer>
  )
}
