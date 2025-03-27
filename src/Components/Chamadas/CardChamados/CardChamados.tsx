"use client";

import React from "react";

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
  // Cores para os status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aberto":
        return "bg-yellow-500 text-white";
      case "pendente":
        return "bg-orange-500 text-white";
      case "concluido":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="bg-blue-100 p-6 justify-between rounded-[10px] shadow-md border border-gray-300">
      <h4 className="text-lg font-semibold text-primary">CHAMADO {chamado.id}</h4>

      <div className="flex flex-wrap items-center space-x-2 mt-2">
        <span className={`px-3 py-1 rounded-md text-xs font-bold ${getStatusColor(chamado.status)}`}>
          STATUS
        </span>
        <span className="px-3 py-1 rounded-md text-xs font-bold bg-white text-red-500">
          🔴 {chamado.sentimento}
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
        <button className="px-5 py-2 bg-white rounded-[20px] w-[143px] text-center text-primary border-primary hover:bg-black hover:text-white transition">
          VER MAIS
        </button>
      </div>

    </div>
  );
};

export default CardChamados;
