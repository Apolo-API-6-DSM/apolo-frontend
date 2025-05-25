"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado } from '@/services/service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  format, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, addMonths,
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isSameMonth
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDashboardDate } from "@/components/graphics/DashboardDateContext";
import DatePicker from 'react-datepicker';

type Periodo = 'dia' | 'semana' | 'mes' | 'trimestre' | 'ano';

export default function MonthlySalesChart() {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [allChamados, setAllChamados] = useState<Chamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<Periodo>('semana');
  const [dataInicio, setDataInicio] = useState<Date>(new Date());
  const [dataFim, setDataFim] = useState<Date>(new Date());
  const { selectedRange } = useDashboardDate(); // usa o filtro global

  // Sincroniza intervalo local com o global
  useEffect(() => {
    if (selectedRange.start) {
      setDataInicio(selectedRange.start);
      setDataFim(selectedRange.end ?? selectedRange.start);
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
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar os dados de tráfego.');
        console.error('Erro ao buscar chamados:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (allChamados.length > 0) {
      atualizarIntervaloDatas();
    }
  }, [allChamados, periodo]); // usa dataLocal

  const atualizarIntervaloDatas = () => {
    const safeDate = dataInicio ?? new Date();
    switch (periodo) {
      case 'dia':
        setDataInicio(startOfDay(safeDate));
        setDataFim(endOfDay(safeDate));
        break;
      case 'semana':
        setDataInicio(startOfWeek(safeDate, { locale: ptBR }));
        setDataFim(endOfWeek(safeDate, { locale: ptBR }));
        break;
      case 'mes':
        setDataInicio(startOfMonth(safeDate));
        setDataFim(endOfMonth(safeDate));
        break;
      case 'trimestre':
        setDataInicio(startOfMonth(safeDate));
        setDataFim(endOfMonth(addMonths(safeDate, 2)));
        break;
      case 'ano':
        setDataInicio(startOfYear(safeDate));
        setDataFim(endOfYear(safeDate));
        break;
    }
    // Removido: processTrafficData();
  };

  // Novo useEffect para processar os dados após atualização dos intervalos
  useEffect(() => {
    if (allChamados.length > 0 && dataInicio && dataFim) {
      processTrafficData();
    }
  }, [allChamados, dataInicio, dataFim, periodo]);

  const handlePeriodoChange = (novoPeriodo: Periodo) => {
    setPeriodo(novoPeriodo);
    atualizarIntervaloDatas();
  };

  const processTrafficData = () => {
    // Filtra chamados no intervalo selecionado
    const chamadosFiltrados = allChamados.filter(chamado => {
      if (!chamado.data_abertura) return false;
      const dataChamado = parseISO(chamado.data_abertura);
      return dataChamado >= dataInicio && dataChamado <= dataFim;
    });

    let dataFormatada: any[] = [];

    if (periodo === 'dia') {
      // Agrupa por hora do dia
      const horas: Record<string, number> = {};
      for (let i = 0; i < 24; i++) {
        horas[`${i}h`] = 0;
      }

      chamadosFiltrados.forEach(chamado => {
        const data = parseISO(chamado.data_abertura);
        const hora = format(data, 'H');
        horas[`${hora}h`]++;
      });

      dataFormatada = Object.keys(horas).map(hora => ({
        name: hora,
        value: horas[hora]
      }));
    } else if (periodo === 'semana' || periodo === 'mes') {
      // Cria todos os dias do intervalo, mesmo sem chamados
      let intervalos: Date[] = eachDayOfInterval({ start: dataInicio, end: dataFim });
      // Força o nome do dia para sempre mostrar 3 letras e a data, ex: 'Seg (13/05)'.
      let nomeIntervalo = (date: Date) => {
        const diaSemana = format(date, 'EEE', { locale: ptBR });
        const diaSemanaCorrigido = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1, 3).toLowerCase();
        return `${diaSemanaCorrigido} (${format(date, 'dd/MM')})`;
      };
      dataFormatada = intervalos.map(intervalo => {
        const inicio = startOfDay(intervalo);
        const fim = endOfDay(intervalo);
        const count = chamadosFiltrados.filter(chamado => {
          if (!chamado.data_abertura) return false;
          const dataChamado = parseISO(chamado.data_abertura);
          return dataChamado >= inicio && dataChamado <= fim;
        }).length;
        return {
          name: nomeIntervalo(intervalo),
          value: count,
          date: intervalo
        };
      });
    } else {
      // Cria intervalos conforme o período selecionado
      let intervalos: Date[] = [];
      let formato: string;
      let nomeIntervalo: (date: Date) => string;

      switch (periodo) {
        case 'trimestre':
          intervalos = eachMonthOfInterval({
            start: dataInicio,
            end: dataFim
          });
          formato = 'MMM'; // Mês abreviado
          nomeIntervalo = (date) => format(date, 'MMM/yyyy', { locale: ptBR });
          break;
        case 'ano':
          intervalos = eachMonthOfInterval({ start: dataInicio, end: dataFim });
          formato = 'MMM'; // Mês abreviado
          nomeIntervalo = (date) => format(date, 'MMM', { locale: ptBR });
          break;
        default:
          intervalos = [];
      }

      // Conta chamados por intervalo
      dataFormatada = intervalos.map(intervalo => {
        const inicio = startOfMonth(intervalo);
        const fim = endOfMonth(intervalo);
        const count = chamadosFiltrados.filter(chamado => {
          if (!chamado.data_abertura) return false;
          const dataChamado = parseISO(chamado.data_abertura);
          return dataChamado >= inicio && dataChamado <= fim;
        }).length;
        return {
          name: nomeIntervalo(intervalo),
          value: count,
          date: intervalo
        };
      });
    }

    setTrafficData(dataFormatada);
  };

  // Adiciona o DatePicker local para filtro de data, mas sincroniza com o filtro global
  const [dataInicioLocal, setDataInicioLocal] = useState<Date>(selectedRange.start ?? new Date());
  const [dataFimLocal, setDataFimLocal] = useState<Date>(selectedRange.end ?? new Date());

  useEffect(() => {
    if (selectedRange.start) setDataInicioLocal(selectedRange.start);
    if (selectedRange.end) setDataFimLocal(selectedRange.end);
  }, [selectedRange]);

  useEffect(() => {
    if (allChamados.length > 0 && dataInicioLocal && dataFimLocal) {
      setDataInicio(dataInicioLocal);
      setDataFim(dataFimLocal);
    }
  }, [allChamados, dataInicioLocal, dataFimLocal]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg dark:text-white font-medium mb-4">Tráfego de Chamados</h3>
        <div className="h-80 bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg dark:text-white font-medium mb-4">Tráfego de Chamados</h3>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Adiciona o select de período novamente
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg dark:text-white font-medium">Tráfego de Chamados</h3>
        <div className="flex items-center gap-2 -translate-x-10">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <label className="text-xs mb-1 text-gray-600 dark:text-gray-300">Início</label>
              <DatePicker
                selected={dataInicioLocal}
                onChange={date => setDataInicioLocal(date ?? new Date())}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-"
                locale={ptBR}
                maxDate={new Date()}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs mb-1 text-gray-600 dark:text-gray-300">Fim</label>
              <DatePicker
                selected={dataFimLocal}
                onChange={date => setDataFimLocal(date ?? new Date())}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
                locale={ptBR}
                maxDate={new Date()}
              />
            </div>
          </div>
        </div>  
      </div>
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
              stroke="#2196F3"
              name="Chamados"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}