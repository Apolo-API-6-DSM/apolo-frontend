"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { fetchTickets, Chamado } from '@/services/service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Periodo = 'mes' | 'ano';
type TrafficData = { name: string; value: number };

export default function MonthlySalesChartHome() {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [allChamados, setAllChamados] = useState<Chamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTickets();
        if (result.success) {
          setAllChamados(result.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTrafficData = useCallback(() => {
    const dataInicio = periodo === 'mes'
      ? startOfMonth(dataSelecionada)
      : startOfYear(dataSelecionada);

    const dataFim = periodo === 'mes'
      ? endOfMonth(dataSelecionada)
      : endOfYear(dataSelecionada);

    const chamadosFiltrados = allChamados.filter(chamado => {
      if (!chamado.data_abertura) return false;
      const dataChamado = parseISO(chamado.data_abertura);
      return dataChamado >= dataInicio && dataChamado <= dataFim;
    });

    const intervalos = eachMonthOfInterval({
      start: startOfYear(dataSelecionada),
      end: endOfYear(dataSelecionada),
    });

    const dataFormatada = intervalos.map(intervalo => {
      const inicio = startOfMonth(intervalo);
      const fim = endOfMonth(intervalo);

      const count = chamadosFiltrados.filter(chamado => {
        if (!chamado.data_abertura) return false;
        const dataChamado = parseISO(chamado.data_abertura);
        return dataChamado >= inicio && dataChamado <= fim;
      }).length;

      return {
        name: format(intervalo, periodo === 'mes' ? 'MMM' : 'MMM/yyyy', { locale: ptBR }),
        value: count,
      };
    });

    setTrafficData(periodo === 'mes'
      ? dataFormatada.filter(item => item.name === format(dataSelecionada, 'MMM', { locale: ptBR }))
      : dataFormatada);
  }, [allChamados, periodo, dataSelecionada]);

  useEffect(() => {
    if (allChamados.length > 0) {
      processTrafficData();
    }
  }, [allChamados, periodo, dataSelecionada, processTrafficData]);

  if (isLoading) {
    return (
      <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium dark:text-white">Chamados por Período</h3>
        <div className="flex items-center gap-3">
          <select 
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as Periodo)}
            className="bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="mes">Mês</option>
            <option value="ano">Ano</option>
          </select>
          
          {periodo === 'mes' ? (
            <DatePicker
              selected={dataSelecionada}
              onChange={(date) => setDataSelecionada(date || new Date())}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="bg-white dark:bg-gray-700 border dark:text-white border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
              popperClassName="!z-50 w-full max-w-[280px]"
              locale={ptBR}
            />
          ) : (
            <DatePicker
              selected={dataSelecionada}
              onChange={(date) => setDataSelecionada(date || new Date())}
              dateFormat="yyyy"
              showYearPicker
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:text-white dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
              popperClassName="!z-50 w-full max-w-[280px]"
              locale={ptBR}
            />
          )}
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trafficData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" strokeOpacity={0.3} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Chamados"
              fill="#3182ce"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
