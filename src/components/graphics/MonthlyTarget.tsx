// components/ecommerce/MonthlyTarget.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, formatStatus, Chamado } from '@/services/service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function MonthlyTarget() {
  const [statusData, setStatusData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
          
          processStatusData(formattedData);
          setError(null);
        } else {
          throw new Error(result.error);
        }
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar os dados de status.');
        console.error('Erro ao buscar chamados:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processStatusData = (data: Chamado[]) => {
    // Processar dados para o gráfico de status
    const statusCount: Record<string, number> = {};
    
    data.forEach(chamado => {
      if (chamado.status) {
        statusCount[chamado.status] = (statusCount[chamado.status] || 0) + 1;
      }
    });
    
    const statusDataArray = Object.keys(statusCount).map(status => ({
      name: status,
      value: statusCount[status]
    }));
    setStatusData(statusDataArray);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-medium mb-4">Chamados por Status</h3>
        <div className="h-80 bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-medium mb-4">Chamados por Status</h3>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2" >
      <h3 className="text-lg font-medium mb-4 dark:text-white text-center">Chamados por Status</h3>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={statusData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={120} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Quantidade" fill="#3182ce">
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}