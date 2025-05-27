"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado, formatTipoChamado } from '@/services/service';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function PizzaTipoChamadoChartHome() {
  const [tipoChamadoData, setTipoChamadoData] = useState<{ name: string; value: number }[]>([]);
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
          processTipoChamadoData(result.data);
        }
      } catch (error) {
        console.error('Erro ao buscar tickets:', error);
      }
    };

    fetchData();
  }, []);

  const processTipoChamadoData = (data: Chamado[]) => {
    const tipoChamadoCount: Record<string, number> = {};

    data.forEach(chamado => {
      if (chamado.tipo_documento) {
        const tipo = formatTipoChamado(chamado.tipo_documento).trim();
        if (tipo) tipoChamadoCount[tipo] = (tipoChamadoCount[tipo] || 0) + 1;
      }
    });

    const filteredData = Object.entries(tipoChamadoCount)
      .filter(([name]) => !["Não informado", "N/A", ""].includes(name))
      .map(([name, value]) => ({ name, value }));

    setTipoChamadoData(filteredData);
  };

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={tipoChamadoData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {tipoChamadoData.map((entry, index) => {
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
              paddingTop: '5px',
            }}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
