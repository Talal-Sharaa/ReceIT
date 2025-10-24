"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { Receit } from './types';
import { sampleReceits } from './sample-data';

interface ReceitContextType {
  receits: Receit[];
  isLoading: boolean;
  addReceit: (receit: Receit) => void;
  updateReceit: (receit: Receit) => void;
  deleteReceit: (id: string, withLinked?: boolean) => void;
  getReceitById: (id: string) => Receit | undefined;
  categories: string[];
}

const ReceitContext = createContext<ReceitContextType | undefined>(undefined);

export const ReceitProvider = ({ children }: { children: ReactNode }) => {
  const [receits, setReceits] = useState<Receit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs once on mount to load from localStorage.
    try {
      const savedReceits = localStorage.getItem('receits');
      if (savedReceits) {
        const parsedReceits = JSON.parse(savedReceits);
        setReceits(parsedReceits.map((r: any) => ({
          ...r,
          startDate: new Date(r.startDate),
          dueDate: new Date(r.dueDate),
        })));
      } else {
        setReceits(sampleReceits); // Load sample data if nothing is in storage
      }
    } catch (error) {
      console.error("Failed to parse receits from localStorage", error);
      setReceits(sampleReceits); // Fallback to sample data on error
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect runs whenever receits change (and not during initial load)
    // to save to localStorage.
    if (!isLoading) {
        localStorage.setItem('receits', JSON.stringify(receits));
    }
  }, [receits, isLoading]);

  const addReceit = useCallback((receit: Receit) => {
    setReceits(prev => [...prev, receit]);
  }, []);

  const updateReceit = useCallback((updatedReceit: Receit) => {
    setReceits(prev => prev.map(r => r.id === updatedReceit.id ? updatedReceit : r));
  }, []);

  const deleteReceit = useCallback((id: string, withLinked: boolean = false) => {
    setReceits(prev => {
      const receitToDelete = prev.find(r => r.id === id);
      if (!receitToDelete) return prev;

      let idsToDelete = [id];
      if (withLinked) {
        idsToDelete = [...idsToDelete, ...receitToDelete.linkedReceits];
      }
      
      // Also remove the deleted receit from any other receit's linkedReceits array
      return prev.filter(r => !idsToDelete.includes(r.id))
                 .map(r => ({
                    ...r,
                    linkedReceits: r.linkedReceits.filter(linkedId => !idsToDelete.includes(linkedId))
                 }));
    });
  }, []);
  
  const getReceitById = useCallback((id: string) => {
    return receits.find(r => r.id === id);
  }, [receits]);

  const categories = React.useMemo(() => {
    const allCategories = new Set(receits.map(r => r.category));
    sampleReceits.forEach(r => allCategories.add(r.category));
    return [...allCategories];
  }, [receits]);

  return (
    <ReceitContext.Provider value={{ receits, isLoading, addReceit, updateReceit, deleteReceit, getReceitById, categories }}>
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
