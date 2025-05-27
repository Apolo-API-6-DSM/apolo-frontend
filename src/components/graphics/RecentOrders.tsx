"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, formatStatus, Chamado } from '@/services/service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

export default function RecentOrders() {
  const [tipoData, setTipoData] = useState<ChartData[]>([]);
  const [responsavelData, setResponsavelData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tipo' | 'responsavel'>('tipo');
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
        if (result.success) {
          const formattedData = result.data.map((chamado: Chamado) => ({
            ...chamado,
            status: formatStatus(chamado.status)
          }));

          processData(formattedData);
          setError(null);
        } else {
          throw new Error(result.error);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error('Erro ao buscar chamados:', err);
        } else {
          setError('Falha ao carregar os dados.');
          console.error('Erro desconhecido ao buscar chamados:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processData = (data: Chamado[]) => {
    // Processar dados para o gráfico de tipo de importação
    const tipoCount: Record<string, number> = {};

    data.forEach(chamado => {
      if (chamado.tipo_importacao) {
        tipoCount[chamado.tipo_importacao] = (tipoCount[chamado.tipo_importacao] || 0) + 1;
      } else {
        tipoCount['Não informado'] = (tipoCount['Não informado'] || 0) + 1;
      }
    });

    const tipoDataArray = Object.keys(tipoCount).map(tipo => ({
      name: tipo,
      value: tipoCount[tipo]
    }));
    setTipoData(tipoDataArray);

    // Processar dados para o gráfico de responsáveis (top 5)
    const responsavelCount: Record<string, number> = {};

    data.forEach(chamado => {
      if (chamado.responsavel) {
        responsavelCount[chamado.responsavel] = (responsavelCount[chamado.responsavel] || 0) + 1;
      } else {
        responsavelCount['Não atribuído'] = (responsavelCount['Não atribuído'] || 0) + 1;
      }
    });

    // Ordenar e pegar os top 5
    const sortedResponsaveis = Object.entries(responsavelCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([responsavel, count]) => ({
        name: responsavel,
        value: count
      }));

    setResponsavelData(sortedResponsaveis);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-medium mb-4">Análise por Categorias</h3>
        <div className="h-80 bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-medium mb-4">Análise por Categorias</h3>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
      <div className="flex dark:text-white justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Análise por Categorias</h3>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded dark:text-black ${activeTab === 'tipo' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('tipo')}
          >
            Tipo
          </button>
          <button
            className={`px-3 py-1 rounded dark:text-black ${activeTab === 'responsavel' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('responsavel')}
          >
            Responsáveis
          </button>
        </div>
      </div>

      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'tipo' ? (
            <BarChart
              data={tipoData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Quantidade" fill="#3182ce">
                {tipoData.map((entry, index) => {
                  const color = colorMap[entry.name] || COLORS[index % COLORS.length];
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={responsavelData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Quantidade" fill="#3182ce">
                {responsavelData.map((entry, index) => {
                  const color = colorMap[entry.name] || COLORS[index % COLORS.length];
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
