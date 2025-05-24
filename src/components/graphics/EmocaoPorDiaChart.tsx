"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado } from '@/services/service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDashboardDate } from "@/components/graphics/DashboardDateContext";
import  DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EmocaoPorDiaChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [allChamados, setAllChamados] = useState<Chamado[]>([]);
  const { selectedRange } = useDashboardDate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const processChartData = (chamados: Chamado[], start: Date, end: Date | null) => {
    // Filtra chamados no intervalo selecionado
    const startDate = format(start, 'yyyy-MM-dd');
    const endDate = end ? format(end, 'yyyy-MM-dd') : startDate;
    const chamadosNoIntervalo = chamados.filter(chamado => {
      if (!chamado.data_abertura) return false;
      const chamadoDate = format(parseISO(chamado.data_abertura), 'yyyy-MM-dd');
      return chamadoDate >= startDate && chamadoDate <= endDate;
    });

    // Conta sentimentos
    const contagem = { positivo: 0, neutro: 0, negativo: 0 };
    chamadosNoIntervalo.forEach(chamado => {
      if (!chamado.sentimento_cliente) return;
      const sentimento = chamado.sentimento_cliente.toLowerCase();
      if (sentimento.includes('positiv')) contagem.positivo++;
      else if (sentimento.includes('neutr')) contagem.neutro++;
      else if (sentimento.includes('negativ')) contagem.negativo++;
    });

    // Formata para o gráfico
    const chartData = [{
      data: end ? `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}` : format(start, 'dd/MM/yyyy'),
      positivo: contagem.positivo,
      neutro: contagem.neutro,
      negativo: contagem.negativo
    }];
    setData(chartData);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg dark:text-white font-bold mb-2">Emoções Por Dia</h3>
        <div className="h-80 bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg dark:text-white font-bold mb-2">Emoções Por Dia</h3>
        <div className="h-80 flex items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg dark:text-white font-bold">Emoções Por Dia</h3>
        <div className="relative">
          <DatePicker
            selected={dataLocal}
            onChange={date => setDataLocal(date ?? new Date())}
            dateFormat="dd/MM/yyyy"
            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm w-[120px]"
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
              <Bar dataKey="positivo" fill="#4CAF50" name="Positivo" />
              <Bar dataKey="neutro" fill="#FFEB3B" name="Neutro" />
              <Bar dataKey="negativo" fill="#F44336" name="Negativo" />
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

export default EmocaoPorDiaChart;