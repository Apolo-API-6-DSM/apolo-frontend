"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado } from '@/services/service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDashboardDate } from './DashboardDateContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ChamadoPorDiaChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [allChamados, setAllChamados] = useState<Chamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedRange } = useDashboardDate();

  // Adiciona novamente o DatePicker local para filtro específico
  const [dataLocal, setDataLocal] = useState<Date>(selectedRange.start ?? new Date());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTickets();
        if (result.success) {
          setAllChamados(result.data);
          setError(null);
        } else {
          throw new Error(result.error || 'Erro ao buscar chamados');
        }
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar dados');
        console.error('Erro:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (allChamados.length > 0 && selectedRange.start) {
      processChartData(allChamados, selectedRange.start, selectedRange.end);
    }
  }, [allChamados, selectedRange]);

  useEffect(() => {
    if (selectedRange.start) setDataLocal(selectedRange.start);
  }, [selectedRange]);

  const formatTipoDocumento = (tipo: string): string => {
    if (!tipo) return 'Outros';
    
    // Remove acentos e coloca em minúsculo
    tipo = tipo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    
    // Mapeia variações comuns
    if (tipo.includes('reclamacao') || tipo.includes('reclamação')) return 'Reclamação';
    if (tipo.includes('pedido') && tipo.includes('suporte')) return 'Pedido de Suporte';
    if (tipo.includes('duvida') || tipo.includes('dúvida')) return 'Dúvida';
    
    // Padroniza outros casos (primeira letra maiúscula)
    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
  };

  const processChartData = (chamados: Chamado[], start: Date, end: Date | null) => {
    const startDate = format(start, 'yyyy-MM-dd');
    const endDate = end ? format(end, 'yyyy-MM-dd') : startDate;
    
    // Filtra chamados pelo intervalo de datas
    const chamadosNoIntervalo = chamados.filter(chamado => {
      if (!chamado.data_abertura) return false;
      const chamadoDate = format(parseISO(chamado.data_abertura), 'yyyy-MM-dd');
      return chamadoDate >= startDate && chamadoDate <= endDate;
    });

    // Conta tipos de documento dinamicamente
    const contagem: Record<string, number> = {};

    chamadosNoIntervalo.forEach(chamado => {
      const tipo = formatTipoDocumento(chamado.tipo_documento || '');
      contagem[tipo] = (contagem[tipo] || 0) + 1;
    });

    // Formata para o gráfico
    const chartData = Object.keys(contagem).map(tipo => ({
      name: tipo,
      value: contagem[tipo]
    }));

    // Ordena por quantidade (opcional)
    chartData.sort((a, b) => b.value - a.value);

    setData([{
      data: end ? `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}` : format(start, 'dd/MM/yyyy'),
      ...chartData.reduce((acc, item) => {
        // Substitui espaços por underscore para usar como chave
        const key = item.name.replace(/\s+/g, '_');
        return { ...acc, [key]: item.value };
      }, {})
    }]);
  };

  // Gera as barras dinamicamente
  const renderBars = () => {
    if (data.length === 0) return null;
    // Cores padronizadas: positivo, neutro, negativo, concluído, outros
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
    const defaultColors = ['#2196F3', '#FF9800', '#9C27B0'];
    const entries = Object.entries(data[0]).filter(([key]) => key !== 'data');
    return entries.map(([key, _], index) => {
      const nome = key.replace(/_/g, ' ');
      const cor = colorMap[nome] || defaultColors[index % defaultColors.length];
      return (
        <Bar 
          key={key}
          dataKey={key}
          fill={cor}
          name={nome}
        />
      );
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg dark:text-white font-bold mb-2">Chamados Por Dia</h3>
        <div className="h-80 bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg dark:text-white font-bold mb-2">Chamados Por Dia</h3>
        <div className="h-80 flex items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg dark:text-white font-bold">Chamados Por Dia</h3>
        <div className="relative">
          <DatePicker
            selected={dataLocal}
            onChange={date => setDataLocal(date ?? new Date())}
            dateFormat="dd/MM/yyyy"
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            locale={ptBR}
            maxDate={new Date()}
          />
        </div>
      </div>
      {data.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              {renderBars()}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>Nenhum dado disponível para esta data</p>
        </div>
      )}
    </div>
  );
};

export default ChamadoPorDiaChart;