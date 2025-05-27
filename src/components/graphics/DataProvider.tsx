// components/ecommerce/DataProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchTickets, formatStatus, Chamado } from '@/services/service';

interface DashboardDataContextType {
  chamados: Chamado[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  stats: {
    total: number;
    abertos: number;
    fechados: number;
    emProgresso: number;
  };
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (context === undefined) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  }
  return context;
};

interface DashboardDataProviderProps {
  children: ReactNode;
}

export function DashboardDataProvider({ children }: DashboardDataProviderProps) {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchTickets();
      if (result.success) {
        const formattedData = result.data.map((chamado: { status: string; }) => ({
          ...chamado,
          status: formatStatus(chamado.status)
        }));
        
        setChamados(formattedData);
        setError(null);
      } else {
        throw new Error(result.error);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Erro ao buscar chamados:', err);
      } else {
        setError('Falha ao carregar os chamados. Por favor, tente novamente.');
        console.error('Erro desconhecido ao buscar chamados:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Resumo de estatísticas com tratamento de status
  const getStatsSummary = () => {
    if (chamados.length === 0) return { total: 0, abertos: 0, fechados: 0, emProgresso: 0 }; 
    
    const abertos = chamados.filter(c => 
      c.status?.toLowerCase() === 'aberto' || 
      c.status?.toLowerCase() === 'novo'
    ).length;
    
    const fechados = chamados.filter(c => 
      c.status?.toLowerCase() === 'fechado' || 
      c.status?.toLowerCase() === 'resolvido' ||
      c.status?.toLowerCase() === 'concluído' ||
      c.status?.toLowerCase() === 'cancelado'
    ).length;
    
    const emProgresso = chamados.filter(c => 
      c.status?.toLowerCase() === 'em progresso' || 
      c.status?.toLowerCase() === 'em andamento'
    ).length;
    
    return {
      total: chamados.length,
      abertos,
      fechados,
      emProgresso
    };
  };

  const stats = getStatsSummary();

  const value = {
    chamados,
    isLoading,
    error,
    refreshData: fetchData,
    stats
  };

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}