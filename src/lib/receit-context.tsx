"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
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

export const ReceitProvider = ({ children }: { children: ReactNode }) => {
  const [receits, setReceits] = useState<Receit[]>(sampleReceits);

  const addReceit = useCallback((receit: Receit) => {
    setReceits(prev => [...prev, receit]);
  }, []);

  const updateReceit = useCallback((updatedReceit: Receit) => {
    setReceits(prev => prev.map(r => r.id === updatedReceit.id ? updatedReceit : r));
  }, []);

  const deleteReceit = useCallback((id: string) => {
    setReceits(prev => prev.filter(r => r.id !== id));
  }, []);
  
  const getReceitById = useCallback((id: string) => {
    return receits.find(r => r.id === id);
  }, [receits]);

  const categories = React.useMemo(() => [...new Set(receits.map(r => r.category))], [receits]);

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
