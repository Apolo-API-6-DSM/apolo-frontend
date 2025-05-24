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

    const getSentimentoEmoji = (sentimento: string) => {
      const lowerSentimento = sentimento.toLowerCase();
      if (lowerSentimento === 'positiva') return '😊';
      if (lowerSentimento === 'neutra') return '😐';
      if (lowerSentimento === 'negativa') return '😞';
      return <FaSmile className="text-gray-500 dark:text-gray-400" />; // Default
    };
  
    const getStatusBgColor = (status: string) => {
      const lowerStatus = status.toLowerCase();
      if (lowerStatus === 'aberto' || lowerStatus === 'em andamento') return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300';
      if (lowerStatus === 'pendente' || lowerStatus === 'aguardando pelo suporte' || lowerStatus === 'itens pendentes') return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300';
      if (lowerStatus === 'concluido' || lowerStatus === 'concluído' || lowerStatus === 'concluída' || lowerStatus === 'resolvido' || lowerStatus === 'fechado') return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';
      return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'; // Default
    };
  
    const getIconColor = () => 'text-gray-600 dark:text-gray-400';

    return (
      <div
        className="border p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        onClick={handleVerMais}
      >
        {/* Top */}
        <div className="flex justify-between items-center mb-2">
          {/* Infos principais */}
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">CHAMADO {chamado.id}</h2>
  
            <div className="flex items-center gap-1">
              {getSentimentoEmoji(chamado.sentimento)}
              <span className="text-gray-700 dark:text-gray-300">{chamado.sentimento}</span>
            </div>
  
            <div className="flex items-center gap-1">
              <FaCommentDots className={getIconColor()} />
                <span className="text-black-700 dark:text-gray-300 font-bold">{chamado.tipo}</span>
            </div>
  
            <div className="flex items-center gap-1">
              <FaClock className={getIconColor()} />
              <span className="text-gray-700 dark:text-gray-300">{periodoData}</span>
            </div>
  
            <div className="flex items-center gap-1">
              <FaUser className={getIconColor()} />
              <span className="text-gray-700 dark:text-gray-300">{chamado.responsavel}</span>
            </div>
          </div>
  
          {/* Status */}
          <div>
            <span className={`${getStatusBgColor(chamado.status)} text-xs font-semibold px-3 py-1 rounded-full`}>
              {chamado.status}
            </span>
          </div>
        </div>
  
        {/* Linha Tracejada */}
        <hr className="border-dashed border-gray-400 dark:border-gray-600 my-2" />
  
        {/* Título */}
        <div className="text-center font-medium text-lg text-gray-800 dark:text-gray-100">{chamado.titulo}</div>
  
      </div>
    );
  };

export default CardChamados;
