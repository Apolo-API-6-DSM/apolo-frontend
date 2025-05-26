"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado } from '@/services/service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths,
  eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDashboardDate } from "@/components/graphics/DashboardDateContext";
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
  const { selectedRange } = useDashboardDate();

  // Sincroniza com o filtro global
  useEffect(() => {
    if (selectedRange.start) {
      setDataSelecionada(selectedRange.start);
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
  }, [allChamados, periodo, dataSelecionada]);

  const atualizarIntervaloDatas = () => {
    // Se houver intervalo global, usa ele
    if (selectedRange.start && selectedRange.end) {
      setDataInicio(selectedRange.start);
      setDataFim(selectedRange.end);
      processTrafficData();
      return;
    }

    // Caso contrário, usa o período selecionado
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

    if (periodo === 'dia' || (selectedRange.start && selectedRange.end && selectedRange.start.getTime() === selectedRange.end.getTime())) {
      // Agrupa por hora do dia
      const horas: Record<string, {positivo: number, neutro: number, negativo: number}> = {};
      for (let i = 0; i < 24; i++) {
        horas[`${i}h`] = {positivo: 0, neutro: 0, negativo: 0};
      }

      chamadosFiltrados.forEach(chamado => {
        if (!chamado.sentimento_cliente) return;
        const data = parseISO(chamado.data_abertura);
        const hora = format(data, 'H');
        const sentimento = chamado.sentimento_cliente.toLowerCase();
        
        if (sentimento.includes('positiv')) horas[`${hora}h`].positivo++;
        else if (sentimento.includes('neutr')) horas[`${hora}h`].neutro++;
        else if (sentimento.includes('negativ')) horas[`${hora}h`].negativo++;
      });

      dataFormatada = Object.keys(horas).map(hora => ({
        name: hora,
        positivo: horas[hora].positivo,
        neutro: horas[hora].neutro,
        negativo: horas[hora].negativo
      }));
    } else {
      // Cria intervalos conforme o período selecionado
      let intervalos: Date[] = [];
      let nomeIntervalo: (date: Date) => string;

      if (selectedRange.start && selectedRange.end) {
        // Usa intervalo personalizado
        intervalos = eachDayOfInterval({ start: selectedRange.start, end: selectedRange.end });
        nomeIntervalo = (date) => format(date, 'dd/MM', { locale: ptBR });
      } else {
        // Usa período pré-definido
        switch(periodo) {
          case 'semana':
            intervalos = eachDayOfInterval({ start: dataInicio, end: dataFim });
            nomeIntervalo = (date) => {
              const diaSemana = format(date, 'EEE', { locale: ptBR });
              return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1, 3)} (${format(date, 'dd/MM')})`;
            };
            break;
          case 'mes':
            intervalos = eachDayOfInterval({ start: dataInicio, end: dataFim });
            nomeIntervalo = (date) => format(date, 'dd/MM');
            break;
          case 'trimestre':
            intervalos = eachMonthOfInterval({ start: dataInicio, end: dataFim });
            nomeIntervalo = (date) => format(date, 'MMM/yyyy', { locale: ptBR });
            break;
          case 'ano':
            intervalos = eachMonthOfInterval({ start: dataInicio, end: dataFim });
            nomeIntervalo = (date) => format(date, 'MMM', { locale: ptBR });
            break;
          default:
            intervalos = [];
        }
      }

      // Conta sentimentos por intervalo
      dataFormatada = intervalos.map(intervalo => {
        const inicio = periodo === 'dia' ? startOfDay(intervalo) : 
                      periodo === 'semana' || periodo === 'mes' ? startOfDay(intervalo) :
                      startOfMonth(intervalo);
        
        const fim = periodo === 'dia' ? endOfDay(intervalo) : 
                   periodo === 'semana' || periodo === 'mes' ? endOfDay(intervalo) : 
                   endOfMonth(intervalo);

        const contagem = { positivo: 0, neutro: 0, negativo: 0 };
        
        chamadosFiltrados.forEach(chamado => {
          if (!chamado.data_abertura || !chamado.sentimento_cliente) return;
          const dataChamado = parseISO(chamado.data_abertura);
          if (dataChamado >= inicio && dataChamado <= fim) {
            const sentimento = chamado.sentimento_cliente.toLowerCase();
            if (sentimento.includes('positiv')) contagem.positivo++;
            else if (sentimento.includes('neutr')) contagem.neutro++;
            else if (sentimento.includes('negativ')) contagem.negativo++;
          }
        });
        
        return {
          name: nomeIntervalo(intervalo),
          positivo: contagem.positivo,
          neutro: contagem.neutro,
          negativo: contagem.negativo,
          date: intervalo
        };
      });
    }

    setTrafficData(dataFormatada);
  };

  const renderDatePicker = () => {
    const pickerClasses = "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-[180px]";
    const wrapperClasses = "flex items-center gap-6 flex-wrap";

    // Se houver intervalo global, não mostra os seletores locais
    if (selectedRange.start && selectedRange.end) {
      return (
        <div className={`${wrapperClasses} dark:text-white`}>
          <span>
            {format(selectedRange.start, 'dd/MM/yyyy')} - {format(selectedRange.end, 'dd/MM/yyyy')}
          </span>
        </div>
      );
    }

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
        <h3 className="text-lg dark:text-white font-medium mb-4">Emoções por Período</h3>
        <div className="h-80 bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg dark:text-white font-medium mb-4">Emoções por Período</h3>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg dark:text-white font-medium">Emoções por Período</h3>
        <div className="flex items-center gap-2">
          {!(selectedRange.start && selectedRange.end) && (
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
          )}
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
              dataKey="positivo" 
              stroke="#4CAF50" 
              name="Positivo" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="neutro" 
              stroke="#FFEB3B" 
              name="Neutro" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="negativo" 
              stroke="#F44336" 
              name="Negativo" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}