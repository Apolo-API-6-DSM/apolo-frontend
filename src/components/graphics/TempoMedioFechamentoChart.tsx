import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado } from '@/services/service';

export default function TempoMedioFechamentoCard() {
  const [tempoMedio, setTempoMedio] = useState<string>("Calculando...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calcularTempoMedio = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTickets();
        if (result.success) {
          const chamados = result.data;
          
          // Filtra apenas chamados concluídos (opcional)
          const chamadosConcluidos = chamados.filter(chamado => 
            chamado.status.toLowerCase().includes('concluído') || 
            chamado.status.toLowerCase().includes('resolvido')
          );

          // Usa todos os chamados ou apenas os concluídos
          const chamadosParaCalculo = chamadosConcluidos.length > 0 ? chamadosConcluidos : chamados;
          
          if (chamadosParaCalculo.length === 0) {
            setTempoMedio("Sem dados");
            return;
          }

          // Calcula a diferença média em milissegundos
          const totalDiferenca = chamadosParaCalculo.reduce((acc, chamado) => {
            if (!chamado.data_abertura || !chamado.ultima_atualizacao) {
              return acc;
            }
            
            const dataAbertura = new Date(chamado.data_abertura);
            const dataFechamento = new Date(chamado.ultima_atualizacao);
            
            return acc + (dataFechamento.getTime() - dataAbertura.getTime());
          }, 0);

          const mediaMs = totalDiferenca / chamadosParaCalculo.length;
          
          // Converte para formato legível
          setTempoMedio(formatarTempo(mediaMs));
          setError(null);
        } else {
          throw new Error(result.error || 'Erro ao buscar chamados');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao calcular tempo médio');
        setTempoMedio("Erro");
      } finally {
        setIsLoading(false);
      }
    };

    calcularTempoMedio();
  }, []);

  // Função para formatar milissegundos em formato legível
  const formatarTempo = (ms: number): string => {
    if (ms <= 0) return "0 dias";
    
    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    const horasRestantes = horas % 24;
    const minutosRestantes = minutos % 60;
    
    let resultado = [];
    if (dias > 0) resultado.push(`${dias} dia${dias > 1 ? 's' : ''}`);
    if (horasRestantes > 0) resultado.push(`${horasRestantes}h`);
    if (minutosRestantes > 0 && dias === 0) resultado.push(`${minutosRestantes}m`);
    
    return resultado.join(' ') || "0 dias";
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 text-center rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
        <h3 className="text-sm dark:text-white font-medium text-gray-500">Tempo Médio de Fechamento</h3>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 text-center rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
        <h3 className="text-sm dark:text-white font-medium text-gray-500">Tempo Médio de Fechamento</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
      <h3 className="text-sm dark:text-white font-medium text-gray-500">Tempo Médio de Fechamento</h3>
      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{tempoMedio}</p>
    </div>
  );
}