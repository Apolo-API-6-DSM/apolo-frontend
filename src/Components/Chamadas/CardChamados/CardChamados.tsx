"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaSmile, FaCommentDots, FaClock, FaUser } from "react-icons/fa";

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

  const handleVerMais = () => {
    router.push(`/chamados/${chamado.id}`);
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return '';
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return '';
      
      return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')} ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
    } catch (e) {
      return '';
    }
  };

  const periodoData = chamado.dataFim
    ? `${formatarData(chamado.dataInicio)} - ${formatarData(chamado.dataFim)}`
    : formatarData(chamado.dataInicio);

  return (
    <div
      className="border p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all"
      onClick={handleVerMais}
    >
      {/* Top */}
      <div className="flex justify-between items-center mb-2">
        {/* Infos principais */}
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="font-bold text-xl">CHAMADO {chamado.id}</h2>

          <div className="flex items-center gap-1">
            <FaSmile className="text-green-500" />
            <span>{chamado.sentimento}</span>
          </div>

          <div className="flex items-center gap-1">
            <FaCommentDots className="text-gray-600" />
            <span>{chamado.tipo}</span>
          </div>

          <div className="flex items-center gap-1">
            <FaClock className="text-gray-600" />
            <span>{periodoData}</span>
          </div>

          <div className="flex items-center gap-1">
            <FaUser className="text-gray-600" />
            <span>{chamado.responsavel}</span>
          </div>
        </div>

        {/* Status */}
        <div>
          <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
            {chamado.status}
          </span>
        </div>
      </div>

      {/* Linha Tracejada */}
      <hr className="border-dashed border-gray-400 my-2" />

      {/* Título */}
      <div className="text-center font-medium text-lg">{chamado.titulo}</div>

    </div>
  );
};

export default CardChamados;
