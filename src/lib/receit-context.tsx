"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { Receit } from './types';
import { sampleReceits } from './sample-data';

interface ReceitContextType {
  receits: Receit[];
  addReceit: (receit: Receit) => void;
  updateReceit: (receit: Receit) => void;
  deleteReceit: (id: string) => void;
  getReceitById: (id: string) => Receit | undefined;
  categories: string[];
}

const ReceitContext = createContext<ReceitContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

export const ReceitProvider = ({ children }: { children: ReactNode }) => {
  const [receits, setReceits] = useState<Receit[]>(() => {
    if (isServer) {
        return sampleReceits;
    }
    try {
      const savedReceits = localStorage.getItem('receits');
      if (savedReceits) {
        // The object from localStorage needs to have its date strings converted back to Date objects.
        const parsedReceits = JSON.parse(savedReceits);
        return parsedReceits.map((r: any) => ({
          ...r,
          startDate: new Date(r.startDate),
          dueDate: new Date(r.dueDate),
        }));
      }
    } catch (error) {
      console.error("Failed to parse receits from localStorage", error);
    }
    return sampleReceits;
  });

  useEffect(() => {
    if (!isServer) {
        localStorage.setItem('receits', JSON.stringify(receits));
    }
  }, [receits]);

  const addReceit = useCallback((receit: Receit) => {
    setReceits(prev => [...prev, receit]);
  }, []);

  const updateReceit = useCallback((updatedReceit: Receit) => {
    setReceits(prev => prev.map(r => r.id === updatedReceit.id ? updatedReceit : r));
  }, []);

  const deleteReceit = useCallback((id: string) => {
    setReceits(prev => prev.filter(r => r.id !== id && !r.linkedReceits.includes(id)));
  }, []);
  
  const getReceitById = useCallback((id: string) => {
    return receits.find(r => r.id === id);
  }, [receits]);

  const categories = React.useMemo(() => {
    const allCategories = new Set(receits.map(r => r.category));
    // Also include default categories from sample data in case they are all deleted
    sampleReceits.forEach(r => allCategories.add(r.category));
    return [...allCategories];
  }, [receits]);

  return (
    <ReceitContext.Provider value={{ receits, addReceit, updateReceit, deleteReceit, getReceitById, categories }}>
      {children}
    </ReceitContext.Provider>
  );
};

export const useReceits = () => {
  const context = useContext(ReceitContext);
  if (context === undefined) {
    throw new Error('useReceits must be used within a ReceitProvider');
  }
  return context;
};
