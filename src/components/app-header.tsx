"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Receipt, LogOut } from 'lucide-react';
import { ReceitForm } from './receit-form';
import { useAuth } from '@/firebase';

export function AppHeader() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          <Receipt className="h-7 w-7 text-primary" />
          <h1 className="font-headline text-2xl font-semibold text-foreground">
            ReceIT
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New ReceIT
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>
      <ReceitForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
}
