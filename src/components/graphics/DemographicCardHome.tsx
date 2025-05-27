"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado } from '@/services/service';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Definindo o tipo para os dados do gráfico
interface SentimentoData {
  name: string;
  value: number;
}

export default function DemographicCardHome() {
  const [sentimentoData, setSentimentoData] = useState<SentimentoData[]>([]);

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
      try {
        const result = await fetchTickets();
        if (result.success) {
          processSentimentoData(result.data);
        }
      } catch (error) {
        console.error('Erro ao buscar tickets:', error);
      }
    };

    fetchData();
  }, []);

  const processSentimentoData = (data: Chamado[]) => {
    const sentimentoCount: Record<string, number> = {};

    data.forEach(chamado => {
      if (chamado.sentimento_cliente) {
        const sentimento = chamado.sentimento_cliente.trim();
        if (sentimento) {
          sentimentoCount[sentimento] = (sentimentoCount[sentimento] || 0) + 1;
        }
      }
    });

    const filteredData = Object.entries(sentimentoCount)
      .filter(([sentimento]) => !["Não informado", "N/A", ""].includes(sentimento))
      .map(([name, value]) => ({ name, value }));

    setSentimentoData(filteredData);
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sentimentoData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {sentimentoData.map((entry, index) => {
              const color = colorMap[entry.name] || COLORS[index % COLORS.length];
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            height={40}
            wrapperStyle={{
              fontSize: '11px',
              paddingTop: '5px'
            }}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
