"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CardChamadosProps {
  chamado: {
    id: number;
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

  const formatarData = (dataISO: string) => {
    if (!dataISO) return '';
    
    try {
      const data = new Date(dataISO);
      return data.toLocaleDateString('pt-BR');
    } catch (e) {
      return dataISO; // Retorna o original se não puder formatar
    }
  };

  const debugStatus = () => {
    const status = chamado.status || 'undefined';
    const normalized = status.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim();
    console.log('Status debug:', {
      original: status,
      normalized: normalized,
      type: typeof status
    });
  };

  const getStatusColor = () => {
    if (!chamado.status) return "bg-gray-500";

    const normalizedStatus = chamado.status
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const colorMap: Record<string, string> = {
      aberto: "bg-yellow-500",
      pendente: "bg-red-500",
      concluido: "bg-green-500",
      resolvido: "bg-green-500",
      fechado: "bg-green-500",
    };

    return colorMap[normalizedStatus] || "bg-gray-500";
  };

  const getStatusText = () => {
    if (!chamado.status) return "N/D";

    const status = chamado.status.toLowerCase().trim();
    
    if (status === 'Em andamento') return 'ABERTO';
    if (status === 'Aguardando pelo suporte' || status == 'Itens Pendentes') return 'PENDENTE';
    if (status === 'Resolvido' || status === 'Concluído(a)') return 'CONCLUÍDO';
    if (status === 'cancelado') return 'CANCELADO'
    
    return chamado.status.toUpperCase();
  };

  return (
    <div className="bg-blue-100 p-6 rounded-[10px] shadow-md border border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-primary">CHAMADO {chamado.id}</h4>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`px-3 py-1 rounded-md text-xs font-bold text-white ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-white">
              {chamado.sentimento}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-white">
              {chamado.tipo_documento}
            </span>
          </div>

          <div className="mt-4 flex flex-col space-y-1">
            <p className="font-medium text-black">
              <strong>Data Início:</strong> {formatarData(chamado.dataInicio)}
            </p>
            {chamado.dataFim && (
              <p className="font-medium text-black">
                <strong>Data Fim:</strong> {formatarData(chamado.dataFim)}
              </p>
            )}
            <p className="font-medium text-black">
              <strong>Responsável:</strong> {chamado.responsavel}
            </p>
            <p className="font-medium text-black">
              <strong>Tipo:</strong> {chamado.tipo}
            </p>
          </div>
        </div>

        <div className="ml-4 w-1/2 mt-8">
          <p className="text-sm font-semibold text-gray-600 mb-1">TÍTULO</p>
          <p className="text-xl font-bold text-gray-800">
            {chamado.titulo}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button className="px-5 py-2 bg-white rounded-[20px] w-[143px] text-center text-primary border border-primary hover:bg-black hover:text-white transition">
          VER MAIS
        </button>
      </div>
    </div>
  );
};

export default CardChamados;