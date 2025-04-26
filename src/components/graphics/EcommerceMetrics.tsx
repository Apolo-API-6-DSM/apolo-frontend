// components/ecommerce/EcommerceMetrics.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, formatStatus, Chamado } from '@/services/service';

export function EcommerceMetrics() {
  const [isLoading, setIsLoading] = useState(true);
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar os chamados. Por favor, tente novamente.');
        console.error('Erro ao buscar chamados:', err);
      } finally {
        setIsLoading(false);
      }
    };

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2" >
        <h3 className="text-sm dark:text-white font-medium text-gray-500">Total de Chamados</h3>
        <p className="text-3xl font-bold dark:text-white">{stats.total}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2" >
        <h3 className="text-sm dark:text-white font-medium text-gray-500">Chamados Abertos</h3>
        <p className="text-3xl font-bold text-yellow-500">{stats.abertos}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2" >
        <h3 className="text-sm dark:text-white font-medium text-gray-500">Em Progresso</h3>
        <p className="text-3xl font-bold text-blue-500">{stats.emProgresso}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2" >
        <h3 className="text-sm dark:text-white font-medium text-gray-500">Chamados Fechados</h3>
        <p className="text-3xl font-bold text-green-500">{stats.fechados}</p>
      </div>
    </div>
  );
}