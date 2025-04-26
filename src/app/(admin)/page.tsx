"use client";

import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/graphics/EcommerceMetrics";
import MonthlyTarget from "@/components/graphics/MonthlyTarget";
import RecentOrders from "@/components/graphics/RecentOrders";
import DemographicCard from "@/components/graphics/DemographicCard";
import CardHome from "@/components/chamados/cardHome/CardHome";
import Link from "next/link";
import DashboardCharts from "./DashboardCharts";
import { useEffect, useState } from "react";

// export const metadata: Metadata = {
//   title: "Apolo - Home"
// };

interface Chamado {
  id: number;
  status?: string; // Permitindo que status seja undefined
  sentimento_cliente?: string;
  responsavel?: string;
  tipo_importacao?: string;
  data_abertura?: string;
  ultima_atualizacao?: string;
  titulo?: string;
  id_importado?: string;
  tipo_documento?: string;
}

const API_BASE_URL = 'http://localhost:3003';

export default function Ecommerce() {
  const [ultimosChamados, setUltimosChamados] = useState<Chamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUltimosChamados = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/chamados?_sort=data_abertura&_order=desc&_limit=5`);
        if (!response.ok) {
          throw new Error('Erro ao carregar os últimos chamados');
        }
        const data: Chamado[] = await response.json();
        setUltimosChamados(data);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar os últimos chamados. Por favor, tente novamente.');
        console.error('Erro ao buscar os últimos chamados:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUltimosChamados();
  }, []);

  if (isLoading) {
    return <div>Carregando os últimos chamados...</div>;
  }

  if (error) {
    return <div>Erro ao carregar os últimos chamados: {error}</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 min-h-screen">
      {/* Coluna esquerda */}
      <div className="col-span-12 space-y-6 lg:col-span-8">
        <DashboardCharts />
      </div>

      {/* Coluna direita COM SCROLL FIXO */}
      <div className="col-span-12 lg:col-span-4">
        <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col h-full">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Últimos Chamados</h3>
              <Link href="/chamados" className="text-sm font-medium text-[#00163B] hover:text-[#001e4f] dark:text-gray-400 dark:hover:text-gray-200">
                Ver todos
              </Link>
            </div>

            {/* Área de scroll - SOLUÇÃO DEFINITIVA */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              <div className="space-y-4">
                {ultimosChamados.map((chamado) => (
                  <CardHome key={chamado.id} chamado={chamado} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}