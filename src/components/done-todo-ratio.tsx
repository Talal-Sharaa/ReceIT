"use client";

import { useReceits } from "@/lib/receit-context";
import { Progress } from "@/components/ui/progress";

export function DoneTodoRatio() {
  const { receits } = useReceits();

  const { completedPoints, totalPoints } = receits.reduce(
    (acc, receit) => {
      acc.totalPoints += receit.effort;
      if (receit.status === 'Done') {
        acc.completedPoints += receit.effort;
      }
      return acc;
    },
    { completedPoints: 0, totalPoints: 0 }
  );

  const percentage = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="text-2xl font-bold font-headline">{completedPoints} / {totalPoints} pts</div>
      <p className="text-xs text-muted-foreground">
        {percentage.toFixed(0)}% of estimated effort completed
      </p>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
