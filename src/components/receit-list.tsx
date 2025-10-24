
"use client";

import { useReceits } from "@/lib/receit-context";
import { ReceitCard } from "./receit-card";
import { Separator } from "./ui/separator";

export function ReceitList() {
  const { receits, isLoading } = useReceits();

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }
  
  const parentReceitIds = new Set(receits.flatMap(r => r.linkedReceits));

  const todoReceits = receits.filter(r => r.status === 'To-Do');
  const doneReceits = receits.filter(r => r.status === 'Done');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-semibold mb-4">To-Do</h2>
        {todoReceits.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            {todoReceits.map((receit) => (
              <ReceitCard key={receit.id} receit={receit} isParent={parentReceitIds.has(receit.id)} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No tasks to do. Great job!</p>
        )}
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-headline font-semibold mb-4">Done</h2>
        {doneReceits.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            {doneReceits.map((receit) => (
              <ReceitCard key={receit.id} receit={receit} isParent={parentReceitIds.has(receit.id)} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No tasks completed yet.</p>
        )}
      </div>
    </div>
  );
}
