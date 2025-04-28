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

type Periodo = 'dia' | 'semana' | 'mes' | 'trimestre' | 'ano';

export default function MonthlySalesChart() {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [allChamados, setAllChamados] = useState<Chamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<Periodo>('semana');
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [dataInicio, setDataInicio] = useState<Date>(new Date());
  const [dataFim, setDataFim] = useState<Date>(new Date());

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
  }, [allChamados, periodo, dataSelecionada]);

  const atualizarIntervaloDatas = () => {
    switch(periodo) {
      case 'dia':
        setDataInicio(startOfDay(dataSelecionada));
        setDataFim(endOfDay(dataSelecionada));
        break;
      case 'semana':
        setDataInicio(startOfWeek(dataSelecionada, { locale: ptBR }));
        setDataFim(endOfWeek(dataSelecionada, { locale: ptBR }));
        break;
      case 'mes':
        setDataInicio(startOfMonth(dataSelecionada));
        setDataFim(endOfMonth(dataSelecionada));
        break;
      case 'trimestre':
        setDataInicio(startOfMonth(dataSelecionada));
        setDataFim(endOfMonth(addMonths(dataSelecionada, 2)));
        break;
      case 'ano':
        setDataInicio(startOfYear(dataSelecionada));
        setDataFim(endOfYear(dataSelecionada));
        break;
    }
    processTrafficData();
  };

  const handlePeriodoChange = (novoPeriodo: Periodo) => {
    setPeriodo(novoPeriodo);
    // Mantém a data selecionada, apenas atualiza o intervalo
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
    } else {
      // Cria intervalos conforme o período selecionado
      let intervalos: Date[] = [];
      let formato: string;
      let nomeIntervalo: (date: Date) => string;

      switch(periodo) {
        case 'semana':
          intervalos = eachDayOfInterval({ start: dataInicio, end: dataFim });
          formato = 'EEE'; // Dia da semana abreviado
          nomeIntervalo = (date) => format(date, 'EEE (dd/MM)', { locale: ptBR });
          break;
        case 'mes':
          intervalos = eachDayOfInterval({ start: dataInicio, end: dataFim });
          formato = 'dd/MM'; // Dia e mês
          nomeIntervalo = (date) => format(date, 'dd/MM');
          break;
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
        const inicio = periodo === 'dia' ? startOfDay(intervalo) : 
                      periodo === 'semana' || periodo === 'mes' ? startOfDay(intervalo) :
                      startOfMonth(intervalo);
        
        const fim = periodo === 'dia' ? endOfDay(intervalo) : 
                   periodo === 'semana' || periodo === 'mes' ? endOfDay(intervalo) : 
                   endOfMonth(intervalo);

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

// Adicione estas classes ao seu componente
const renderDatePicker = () => {
  const pickerClasses = "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-[180px]";
  const wrapperClasses = "flex items-center gap-6 flex-wrap";

  return (
    <div className={`${wrapperClasses} dark:text-white`}>
      {periodo === 'dia' && (
        <>
          <span>Dia:</span>
          <DatePicker
            selected={dataSelecionada}
            onChange={(date) => setDataSelecionada(date || new Date())}
            dateFormat="dd/MM/yyyy"
            className={`${pickerClasses} dark:text-white`}
            popperClassName="!z-50 w-full max-w-[280px]"
            locale={ptBR}
          />
        </>
      )}

      {periodo === 'semana' && (
        <>
          <span className='dark:text-white'>Semana começando em:</span>
          <DatePicker
            selected={dataSelecionada}
            onChange={(date) => setDataSelecionada(date || new Date())}
            dateFormat="dd/MM/yyyy"
            className={`${pickerClasses} dark:text-white`}
            popperClassName="!z-50 w-full max-w-[280px]"
            locale={ptBR}
          />
          <span className="text-sm text-black dark:text-white">
            {format(dataInicio, 'dd/MM')} a {format(dataFim, 'dd/MM/yyyy')}
          </span>
        </>
      )}

      {periodo === 'mes' && (
        <>
          <span>Mês:</span>
          <DatePicker
            selected={dataSelecionada}
            onChange={(date) => setDataSelecionada(date || new Date())}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className={`${pickerClasses} dark:text-white`}
            popperClassName="!z-50 w-full max-w-[280px]"
            locale={ptBR}
          />
        </>
      )}

      {periodo === 'trimestre' && (
        <>
          <span>Trimestre começando em:</span>
          <DatePicker
            selected={dataSelecionada}
            onChange={(date) => setDataSelecionada(date || new Date())}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className={`${pickerClasses} dark:text-white`}
            popperClassName="!z-50 w-full max-w-[280px]"
            locale={ptBR}
          />
          <span className="text-sm text-black dark:text-white">
            {format(dataInicio, 'MMM/yyyy', { locale: ptBR })} a {format(dataFim, 'MMM/yyyy', { locale: ptBR })}
          </span>
        </>
      )}

      {periodo === 'ano' && (
        <>
          <span>Ano:</span>
          <DatePicker
            selected={dataSelecionada}
            onChange={(date) => setDataSelecionada(date || new Date())}
            dateFormat="yyyy"
            showYearPicker
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[90px]"
            popperClassName="!z-50 w-full max-w-[280px]"
            locale={ptBR}
          />
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
          {renderDatePicker()}
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
              stroke="#3182ce" 
              name="Chamados" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}