"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado } from '@/services/service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, addMonths, 
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDashboardDate } from "@/components/graphics/DashboardDateContext";

type Periodo = 'dia' | 'semana' | 'mes' | 'trimestre' | 'ano';

export default function MonthlySalesChart() {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [allChamados, setAllChamados] = useState<Chamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<Periodo>('semana');
  const [dataInicio, setDataInicio] = useState<Date>(new Date());
  const [dataFim, setDataFim] = useState<Date>(new Date());
  const { selectedDate } = useDashboardDate(); // data global
  const [dataLocal, setDataLocal] = useState<Date>(selectedDate ?? new Date()); // data local do gráfico

  // Sincroniza data local com a global quando a global muda
  useEffect(() => {
    if (selectedDate) setDataLocal(selectedDate);
  }, [selectedDate]);

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
  }, [allChamados, periodo, dataLocal]); // usa dataLocal

  const atualizarIntervaloDatas = () => {
    const safeDate = dataLocal ?? new Date();
    switch(periodo) {
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

  const handleDataChange = (date: Date | null) => {
    setDataLocal(date ?? new Date());
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

      switch(periodo) {
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

  // Adiciona o DatePicker local ao gráfico
  const renderPeriodoInfo = () => {
    const pickerClasses = "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-[180px]";
    return (
      <div className="flex items-center gap-6 flex-wrap dark:text-white">
        {(periodo === 'dia' || periodo === 'semana' || periodo === 'mes' || periodo === 'trimestre' || periodo === 'ano') && (
          <>
            <DatePicker
              selected={dataLocal}
              onChange={handleDataChange}
              dateFormat={
                periodo === 'dia' || periodo === 'semana' ? 'dd/MM/yyyy' :
                periodo === 'mes' || periodo === 'trimestre' ? 'MM/yyyy' :
                'yyyy'
              }
              showMonthYearPicker={periodo === 'mes' || periodo === 'trimestre'}
              showYearPicker={periodo === 'ano'}
              className={pickerClasses + ' dark:text-white'}
              popperClassName="!z-50 w-full max-w-[280px]"
              locale={ptBR}
            />
            {periodo === 'dia' && (
              <span>Dia selecionado: {format(dataInicio, 'dd/MM/yyyy')}</span>
            )}
            {periodo === 'semana' && (
              <span>Semana: {format(dataInicio, 'dd/MM')} a {format(dataFim, 'dd/MM/yyyy')}</span>
            )}
            {periodo === 'mes' && (
              <span>Mês: {format(dataInicio, 'MM/yyyy')}</span>
            )}
            {periodo === 'trimestre' && (
              <span>Trimestre: {format(dataInicio, 'MM/yyyy')} a {format(dataFim, 'MM/yyyy')}</span>
            )}
            {periodo === 'ano' && (
              <span>Ano: {format(dataInicio, 'yyyy')}</span>
            )}
          </>
        )}
      </div>
    );
  };

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg dark:text-white font-medium">Tráfego de Chamados</h3>
        <div className="flex items-center gap-2">
          <select 
            value={periodo}
            onChange={(e) => handlePeriodoChange(e.target.value as Periodo)}
            className="bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dia">Dia</option>
            <option value="semana">Semana</option>
            <option value="mes">Mês</option>
            <option value="trimestre">Trimestre</option>
            <option value="ano">Ano</option>
          </select>
          {renderPeriodoInfo()}
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