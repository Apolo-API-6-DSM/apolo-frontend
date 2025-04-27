// components/ecommerce/DemographicCard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, formatStatus, Chamado } from '@/services/service';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DemographicCard() {
  const [sentimentoData, setSentimentoData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTickets();
        console.log('Resultado da API:', result); // Log para depuração
        if (result.success) {
          const formattedData = result.data.map((chamado: { status: string; }) => ({
            ...chamado,
            status: formatStatus(chamado.status)
          }));
          
          processSentimentoData(formattedData);
          setError(null);
        } else {
          console.error('Erro retornado pela API:', result.error); // Log do erro retornado
          throw new Error(result.error || 'Erro desconhecido ao buscar os dados.');
        }
      } catch (err: any) {
        console.error('Erro ao buscar chamados:', err); // Log do erro capturado
        setError(err.message || 'Falha ao carregar os dados de sentimento.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processSentimentoData = (data: Chamado[]) => {
    // Processar dados para o gráfico de sentimento
    const sentimentoCount: Record<string, number> = {};
    
    data.forEach(chamado => {
      if (chamado.sentimento_cliente) {
        sentimentoCount[chamado.sentimento_cliente] = (sentimentoCount[chamado.sentimento_cliente] || 0) + 1;
      } else {
        sentimentoCount['Não informado'] = (sentimentoCount['Não informado'] || 0) + 1;
      }
    });
    
    const sentimentoDataArray = Object.keys(sentimentoCount).map(sentimento => ({
      name: sentimento,
      value: sentimentoCount[sentimento]
    }));
    setSentimentoData(sentimentoDataArray);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-medium mb-4">Distribuição por Sentimento</h3>
        <div className="h-80 bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-medium mb-4">Distribuição por Sentimento</h3>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 h-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2" >
      <h3 className="text-lg dark:text-white font-medium mb-4">Distribuição por Sentimento</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sentimentoData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {sentimentoData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}