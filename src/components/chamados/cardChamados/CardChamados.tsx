"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CardChamadosProps {
  chamado: {
    id: number | string;
    status: string;
    sentimento: string;
    dataInicio: string;
    dataFim: string;
    responsavel: string;
    tipo: string;
    tipo_documento: string;
    titulo: string;
  };
}

const CardChamados: React.FC<CardChamadosProps> = ({ chamado }) => {
  const router = useRouter();

  const handleVerMais = () => {
    router.push(`/chamados/${chamado.id.toString()}`);
  };

  const formatarData = (dataISO: string) => {
    if (!dataISO) return '';
    
    try {
      const data = new Date(dataISO);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return dataISO;
    }
  };

  const getStatusColor = () => {
    if (!chamado.status) return "bg-gray-500 dark:bg-gray-600";

    const normalizedStatus = chamado.status
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const colorMap: Record<string, string> = {
      aberto: "bg-yellow-500 dark:bg-yellow-600",
      pendente: "bg-red-500 dark:bg-red-600",
      concluido: "bg-green-500 dark:bg-green-600",
      resolvido: "bg-green-500 dark:bg-green-600",
      fechado: "bg-green-500 dark:bg-green-600",
    };

    return colorMap[normalizedStatus] || "bg-gray-500 dark:bg-gray-600";
  };

  const getStatusText = () => {
    if (!chamado.status) return "N/D";

    const status = chamado.status.toLowerCase().trim();
    
    if (status === 'em andamento') return 'ABERTO';
    if (status === 'aguardando pelo suporte' || status === 'itens pendentes') return 'PENDENTE';
    if (status === 'resolvido' || status === 'concluído(a)') return 'CONCLUÍDO';
    if (status === 'cancelado') return 'CANCELADO';
    
    return chamado.status.toUpperCase();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">CHAMADO {chamado.id}</h4>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            {chamado.sentimento && (
              <span className="px-3 py-1 rounded-full text-xs font-bold border border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {chamado.sentimento}
              </span>
            )}
            {chamado.tipo_documento && (
              <span className="px-3 py-1 rounded-full text-xs font-bold border border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {chamado.tipo_documento}
              </span>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Data Início:</span> {formatarData(chamado.dataInicio)}
            </p>
            {chamado.dataFim && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Data Fim:</span> {formatarData(chamado.dataFim)}
              </p>
            )}
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Responsável:</span> {chamado.responsavel}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Tipo:</span> {chamado.tipo}
            </p>
          </div>
        </div>

        <div className="lg:w-1/2 lg:pl-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">TÍTULO</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {chamado.titulo}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#00163B] bg-white px-4 py-2 text-sm font-medium text-[#00163B] shadow-theme-xs hover:bg-gray-50 hover:text-[#001e4f] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          onClick={handleVerMais}
        >
          VER MAIS
        </button>
      </div>
    </div>
  );
};

export default CardChamados;