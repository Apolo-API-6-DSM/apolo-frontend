"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado, formatTipoChamado } from '@/services/service';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function PizzaTipoChamadoChartHome() {
  const [tipoChamadoData, setTipoChamadoData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTickets();
        if (result.success) {
          processTipoChamadoData(result.data);
        }
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
            {tipoChamadoData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
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