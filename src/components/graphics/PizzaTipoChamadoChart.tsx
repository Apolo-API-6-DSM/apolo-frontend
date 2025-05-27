"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado, formatTipoChamado } from '@/services/service';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'react-datepicker/dist/react-datepicker.css';

// Definir um tipo específico para os dados do gráfico de pizza
interface TipoChamadoChartData {
  name: string;
  value: number;
}

export function PizzaTipoChamadoChart() {
  const [tipoChamadoData, setTipoChamadoData] = useState<TipoChamadoChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const colorMap: Record<string, string> = {
    Concluido: '#2196F3',
    Concluído: '#2196F3',
    Aberto: '#FF9800',
    Pendente: '#9C27B0',
    Outros: '#9C27B0',
    Positivo: '#4CAF50',
    Neutro: '#FFEB3B',
    Negativo: '#F44336',
  };
  const COLORS = ['#2196F3', '#FF9800', '#9C27B0'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTickets();
        console.log('Resultado da API:', result); // Log para depuração
        if (result.success) {
          // O tipo de cada chamado é Chamado, já importado
          const formattedData = result.data.map((chamado: Chamado) => ({
            ...chamado,
            status: formatTipoChamado(chamado.tipo_documento ?? ''),
          }));

          processTipoChamadoData(formattedData);
          setError(null);
        } else {
          console.error('Erro retornado pela API:', result.error);
          throw new Error(result.error || 'Erro desconhecido ao buscar os dados.');
        }
      } catch (err: unknown) {
        // Tratando erro com tipo unknown para segurança
        let errorMessage = 'Falha ao carregar os dados do tipo de documento.';
        if (err instanceof Error) errorMessage = err.message;
        console.error('Erro ao buscar chamados:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTipoChamadoData = (data: Chamado[]) => {
    const tipoChamadoCount: Record<string, number> = {};

    data.forEach(chamado => {
      if (chamado.tipo_documento) {
        tipoChamadoCount[chamado.tipo_documento] = (tipoChamadoCount[chamado.tipo_documento] || 0) + 1;
      }
    });

    const tipoChamadoDataArray: TipoChamadoChartData[] = Object.keys(tipoChamadoCount).map(tipoChamado => ({
      name: tipoChamado,
      value: tipoChamadoCount[tipoChamado],
    }));

    const filteredData = tipoChamadoDataArray.filter(item =>
      !["Não informado", "N/A", ""].includes(item.name)
    );

    setTipoChamadoData(filteredData);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-medium mb-4">Tipo de Chamado</h3>
        <div className="h-80 bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-medium mb-4">Tipo de Chamado</h3>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 h-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
      <h3 className="text-lg dark:text-white font-medium mb-4 text-center">Tipo de Chamado</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tipoChamadoData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {tipoChamadoData.map((entry, index) => {
                const color = colorMap[entry.name] || COLORS[index % COLORS.length];
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
