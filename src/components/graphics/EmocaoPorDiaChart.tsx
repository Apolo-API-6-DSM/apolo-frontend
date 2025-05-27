"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { fetchTickets, Chamado } from '@/services/service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDashboardDate } from "@/components/graphics/DashboardDateContext";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface EmotionChartData {
  name: string;
  positivo: number;
  neutro: number;
  negativo: number;
}

const EmocaoPorDiaChart = () => {
  const [chartData, setChartData] = useState<EmotionChartData[]>([]);
  const [allChamados, setAllChamados] = useState<Chamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedRange } = useDashboardDate();
  const [dataSelecionada, setDataSelecionada] = useState<Date>(selectedRange.start ?? new Date());

  // Sincroniza com o filtro global
  useEffect(() => {
    if (selectedRange.start) {
      setDataSelecionada(selectedRange.start);
    }
  }, [selectedRange]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTickets();
        if (result.success) {
          setAllChamados(result.data);
          setError(null);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        setError((err as Error).message || 'Falha ao carregar os dados.');
        console.error('Erro ao buscar chamados:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processEmotionData = useCallback(() => {
    const inicioDia = startOfDay(dataSelecionada);
    const fimDia = endOfDay(dataSelecionada);

    // Filtra chamados do dia selecionado
    const chamadosDoDia = allChamados.filter(chamado => {
      if (!chamado.data_abertura) return false;
      const dataChamado = parseISO(chamado.data_abertura);
      return dataChamado >= inicioDia && dataChamado <= fimDia;
    });

    // Agrupa por hora do dia
    const horas: Record<string, { positivo: number; neutro: number; negativo: number }> = {};
    for (let i = 0; i < 24; i++) {
      horas[`${i}h`] = { positivo: 0, neutro: 0, negativo: 0 };
    }

    chamadosDoDia.forEach(chamado => {
      if (!chamado.sentimento_cliente || !chamado.data_abertura) return;
      const data = parseISO(chamado.data_abertura);
      const hora = format(data, 'H');
      const sentimento = chamado.sentimento_cliente.toLowerCase();

      if (sentimento.includes('positiv')) horas[`${hora}h`].positivo++;
      else if (sentimento.includes('neutr')) horas[`${hora}h`].neutro++;
      else if (sentimento.includes('negativ')) horas[`${hora}h`].negativo++;
    });

    const dataFormatada: EmotionChartData[] = Object.keys(horas).map(hora => ({
      name: hora,
      positivo: horas[hora].positivo,
      neutro: horas[hora].neutro,
      negativo: horas[hora].negativo
    }));

    setChartData(dataFormatada);
  }, [allChamados, dataSelecionada]);

  useEffect(() => {
    if (allChamados.length > 0 && dataSelecionada) {
      processEmotionData();
    }
  }, [allChamados, dataSelecionada, processEmotionData]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg dark:text-white font-medium mb-4">Emoções por Hora</h3>
        <div className="h-80 bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg dark:text-white font-medium mb-4">Emoções por Hora</h3>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg dark:text-white font-medium">Emoções por Hora</h3>
        <div className="relative">
          <DatePicker
            selected={dataSelecionada}
            onChange={date => setDataSelecionada(date ?? new Date())}
            dateFormat="dd/MM/yyyy"
            className="bg-white dark:bg-gray-700 border dark:text-white border-gray-300 rounded px-2 py-1 text-sm"
            locale={ptBR}
            maxDate={new Date()}
          />
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="positivo" stroke="#4CAF50" name="Positivo" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="neutro" stroke="#FFEB3B" name="Neutro" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="negativo" stroke="#F44336" name="Negativo" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmocaoPorDiaChart;
