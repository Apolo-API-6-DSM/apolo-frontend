// components/ecommerce/MonthlySalesChart.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, formatStatus, Chamado } from '@/services/service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MonthlySalesChart() {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
          
          processTrafficData(formattedData);
          setError(null);
        } else {
          throw new Error(result.error);
        }
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar os dados de tráfego.');
        console.error('Erro ao buscar chamados:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTrafficData = (data: Chamado[]) => {
    // Processar dados para o gráfico de tráfego (chamados por dia da semana)
    const trafficByDay: Record<'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo', number> = {
      'Segunda': 0, 'Terça': 0, 'Quarta': 0, 'Quinta': 0, 'Sexta': 0, 'Sábado': 0, 'Domingo': 0
    };
    
    const dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] = 
      ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    data.forEach(chamado => {
      if (chamado.data_abertura) {
        const date = new Date(chamado.data_abertura);
        const day = date.getDay();
        trafficByDay[dayNames[day]]++;
      }
    });
    
    const trafficDataArray = (Object.keys(trafficByDay) as Array<keyof typeof trafficByDay>).map(day => ({
      name: day,
      value: trafficByDay[day]
    }));
    setTrafficData(trafficDataArray);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4">Tráfego de Chamados</h3>
        <div className="h-80 bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4">Tráfego de Chamados</h3>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-4">Tráfego de Chamados</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trafficData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3182ce" 
              name="Chamados" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}