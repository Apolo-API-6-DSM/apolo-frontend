"use client";

import React from "react";
import { FaSmile, FaCommentDots, FaClock, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface CardHomeProps {
  chamado: {
    id: number;
    status?: string;
    sentimento_cliente?: string;
    responsavel?: string;
    tipo_importacao?: string;
    data_abertura?: string;
    ultima_atualizacao?: string;
    titulo?: string;
    id_importado?: string;
    tipo_documento?: string;
  };
}

const CardHome: React.FC<CardHomeProps> = ({ chamado }) => {
  const router = useRouter();

  const formatarDataSimples = (dataString: string) => {
    if (!dataString) return '';
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return '';
      return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')} - ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
    } catch (e) {
      return '';
    }
  };

  const getSentimentoEmoji = (sentimento: string | undefined) => {
    if (!sentimento) {
      return <FaSmile className="text-gray-500 dark:text-gray-400" />;
    }
    const lowerSentimento = sentimento.toLowerCase();
    if (lowerSentimento === 'positiva') return '😊';
    if (lowerSentimento === 'neutra') return '😐';
    if (lowerSentimento === 'negativa') return '😞';
    return <FaSmile className="text-gray-500 dark:text-gray-400" />;
  };

  const getStatusBgColor = (status: string | undefined) => {
    const lowerStatus = status ? status.toLowerCase() : '';
    if (lowerStatus === 'aberto' || lowerStatus === 'em andamento') return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300';
    if (lowerStatus === 'pendente' || lowerStatus === 'aguardando pelo suporte' || lowerStatus === 'itens pendentes') return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300';
    if (lowerStatus === 'concluido' || lowerStatus === 'concluído' || lowerStatus === 'concluída' || lowerStatus === 'resolvido' || lowerStatus === 'fechado') return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';
    return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
  };

  const getIconColor = () => 'text-gray-600 dark:text-gray-400';

  const handleCardClick = () => {
    router.push(`/chamados/${chamado.id}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Chamado: {chamado.id_importado}</h3>
        {chamado.status && (
          <span className={`${getStatusBgColor(chamado.status)} text-xs font-semibold px-2 py-1 rounded-full`}>
            {chamado.status}
          </span>
        )}
      </div>
      <h4 className="font-bold text-md text-gray-900 dark:text-gray-100 break-words">Título: {chamado.titulo}</h4>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        {getSentimentoEmoji(chamado.sentimento_cliente)}
        {chamado.tipo_importacao && (
          <>
            <span>{chamado.tipo_importacao}</span>
          </>
        )}

        {chamado.data_abertura && <FaClock className={getIconColor()} />}
        <span>{chamado.data_abertura ? formatarDataSimples(chamado.data_abertura) : ''}</span>
        {chamado.responsavel && (
          <>
            <span>Responsável: <br></br>{chamado.responsavel}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CardHome;