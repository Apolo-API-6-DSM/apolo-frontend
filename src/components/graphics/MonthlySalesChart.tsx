"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { fetchTickets, Chamado } from '@/services/service';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  format, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths,
  eachDayOfInterval, eachMonthOfInterval
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDashboardDate } from "@/components/graphics/DashboardDateContext";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Periodo = 'dia' | 'semana' | 'mes' | 'trimestre' | 'ano';

type SentimentoData = {
  name: string;
  positivo: number;
  neutro: number;
  negativo: number;
  date?: Date;
};

export default function MonthlySalesChart() {
  const [trafficData, setTrafficData] = useState<SentimentoData[]>([]);
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

  // Busca chamados
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
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar os dados de tráfego.');
        console.error('Erro ao buscar chamados:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para processar os dados do gráfico
  const processTrafficData = useCallback((inicio: Date, fim: Date) => {
    const chamadosFiltrados = allChamados.filter(chamado => {
      if (!chamado.data_abertura) return false;
      const dataChamado = parseISO(chamado.data_abertura);
      return dataChamado >= inicio && dataChamado <= fim;
    });

    let dataFormatada: SentimentoData[] = [];

    if (periodo === 'dia' || (selectedRange.start && selectedRange.end && selectedRange.start.getTime() === selectedRange.end.getTime())) {
      // Agrupar por hora
      const horas: Record<string, { positivo: number; neutro: number; negativo: number }> = {};
      for (let i = 0; i < 24; i++) {
        horas[`${i}h`] = { positivo: 0, neutro: 0, negativo: 0 };
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
      // Intervalos para outros períodos
      let intervalos: Date[] = [];
      let nomeIntervalo: (date: Date) => string;

      if (selectedRange.start && selectedRange.end) {
        intervalos = eachDayOfInterval({ start: selectedRange.start, end: selectedRange.end });
        nomeIntervalo = (date) => format(date, 'dd/MM', { locale: ptBR });
      } else {
        switch (periodo) {
          case 'semana':
            intervalos = eachDayOfInterval({ start: inicio, end: fim });
            nomeIntervalo = (date) => {
              const diaSemana = format(date, 'EEE', { locale: ptBR });
              return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1, 3)} (${format(date, 'dd/MM')})`;
            };
            break;
          case 'mes':
            intervalos = eachDayOfInterval({ start: inicio, end: fim });
            nomeIntervalo = (date) => format(date, 'dd/MM');
            break;
          case 'trimestre':
            intervalos = eachMonthOfInterval({ start: inicio, end: fim });
            nomeIntervalo = (date) => format(date, 'MMM/yyyy', { locale: ptBR });
            break;
          case 'ano':
            intervalos = eachMonthOfInterval({ start: inicio, end: fim });
            nomeIntervalo = (date) => format(date, 'MMM', { locale: ptBR });
            break;
          default:
            intervalos = [];
            nomeIntervalo = () => '';
        }
      }

      dataFormatada = intervalos.map(intervalo => {
      let inicioIntervalo: Date;
      let fimIntervalo: Date;

      if (periodo === 'semana' || periodo === 'mes') {
        inicioIntervalo = startOfDay(intervalo);
        fimIntervalo = endOfDay(intervalo);
      } else { // trimestre ou ano
        inicioIntervalo = startOfMonth(intervalo);
        fimIntervalo = endOfMonth(intervalo);
      }

        const contagem = { positivo: 0, neutro: 0, negativo: 0 };

        chamadosFiltrados.forEach(chamado => {
          if (!chamado.data_abertura || !chamado.sentimento_cliente) return;
          const dataChamado = parseISO(chamado.data_abertura);
          if (dataChamado >= inicioIntervalo && dataChamado <= fimIntervalo) {
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
  }, [allChamados, periodo, selectedRange]);

  // Função para atualizar intervalo de datas
  const atualizarIntervaloDatas = useCallback(() => {
    if (selectedRange.start && selectedRange.end) {
      setDataInicio(selectedRange.start);
      setDataFim(selectedRange.end);
      processTrafficData(selectedRange.start, selectedRange.end);
      return;
    }

    let inicio = new Date();
    let fim = new Date();

    switch (periodo) {
      case 'dia':
        inicio = startOfDay(dataSelecionada);
        fim = endOfDay(dataSelecionada);
        break;
      case 'semana':
        inicio = startOfWeek(dataSelecionada, { locale: ptBR });
        fim = endOfWeek(dataSelecionada, { locale: ptBR });
        break;
      case 'mes':
        inicio = startOfMonth(dataSelecionada);
        fim = endOfMonth(dataSelecionada);
        break;
      case 'trimestre':
        inicio = startOfMonth(dataSelecionada);
        fim = endOfMonth(addMonths(dataSelecionada, 2));
        break;
      case 'ano':
        inicio = startOfYear(dataSelecionada);
        fim = endOfYear(dataSelecionada);
        break;
    }

    setDataInicio(inicio);
    setDataFim(fim);
    processTrafficData(inicio, fim);
  }, [dataSelecionada, periodo, processTrafficData, selectedRange]);

  // Atualiza dados ao mudar chamados, período, data selecionada ou intervalo global
  useEffect(() => {
    if (allChamados.length > 0) {
      atualizarIntervaloDatas();
    }
  }, [allChamados, periodo, dataSelecionada, atualizarIntervaloDatas]);

  // Muda o período e atualiza datas
  const handlePeriodoChange = (novoPeriodo: Periodo) => {
    setPeriodo(novoPeriodo);
    atualizarIntervaloDatas();
  };

  // Renderiza o seletor de datas conforme período e filtro global
  const renderDatePicker = () => {
    const pickerClasses = "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-[180px]";
    const wrapperClasses = "flex items-center gap-6 flex-wrap";

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
            <span>Semana começando em:</span>
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
              className={`${pickerClasses} dark:text-white`}
              popperClassName="!z-50 w-full max-w-[280px]"
              locale={ptBR}
            />
          </>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <p className="text-center">Carregando dados...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 dark:text-red-400">{error}</p>;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="mb-4 font-bold text-gray-800 dark:text-gray-100">Sentimentos dos Chamados</h2>

      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <div>
          <label className="mr-2 dark:text-white font-semibold">Período:</label>
          <select
            value={periodo}
            onChange={e => handlePeriodoChange(e.target.value as Periodo)}
            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
          >
            <option value="dia">Dia</option>
            <option value="semana">Semana</option>
            <option value="mes">Mês</option>
            <option value="trimestre">Trimestre</option>
            <option value="ano">Ano</option>
          </select>
        </div>

        {renderDatePicker()}
      </div>

      {trafficData.length === 0 ? (
        <p className="text-center dark:text-white">Nenhum dado disponível para o intervalo selecionado.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={trafficData}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="positivo" stroke="#00C49F" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="neutro" stroke="#FFBB28" />
            <Line type="monotone" dataKey="negativo" stroke="#FF8042" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}