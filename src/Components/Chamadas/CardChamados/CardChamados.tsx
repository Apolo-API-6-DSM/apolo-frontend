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
  };
}

const CardChamados: React.FC<CardChamadosProps> = ({ chamado }) => {
  const router = useRouter();

  const handleVerMais = () => {
    router.push(`/chamados/${chamado.id}`);
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

    if (status === "aberto") return "ABERTO";
    if (status === "pendente") return "PENDENTE";
    if (status === "concluído" || status === "concluido") return "CONCLUÍDO";

    return chamado.status.toUpperCase();
  };

  return (
    <div className="bg-blue-100 p-6 justify-between rounded-[10px] shadow-md border border-gray-300">
      <h4 className="text-lg font-semibold text-primary">CHAMADO {chamado.id}</h4>

      <div className="flex flex-wrap items-center space-x-2 mt-2">
        <span className={`px-3 py-1 rounded-md text-xs font-bold text-white ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        <span className="px-3 py-1 rounded-md text-xs font-bold bg-white">
          {chamado.sentimento}
        </span>
      </div>

      <div className="mt-3 flex flex-col space-y-1">
        <p className="font-medium text-black">
          <strong>Data Início:</strong> {chamado.dataInicio}
        </p>
        <p className="font-medium text-black">
          <strong>Data Fim:</strong> {chamado.dataFim}
        </p>
        <p className="font-medium text-black">
          <strong>Responsável:</strong> {chamado.responsavel}
        </p>
        <p className="font-medium text-black">
          <strong>Tipo:</strong> {chamado.tipo}
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="px-5 py-2 bg-white rounded-[20px] w-[143px] text-center text-primary border-primary hover:bg-black hover:text-white transition"
          onClick={handleVerMais}
        >
          VER MAIS
        </button>
      </div>
    </div>
  );
};

export default CardChamados;