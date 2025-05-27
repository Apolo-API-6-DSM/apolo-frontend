"use client";

import React from "react";
import { FaSmile, FaClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1)
        .toString()
        .padStart(2, '0')} - ${data.getHours().toString().padStart(2, '0')}:${data
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const getSentimentoEmoji = (sentimento: string | undefined) => {
    if (!sentimento) {
      return <FaSmile className="text-gray-500 dark:text-gray-400 w-5 h-5" />;
    }

    const lowerSentimento = sentimento.toLowerCase();
    let src = '';

    if (lowerSentimento === 'positiva') src = '/images/emotions/Happy.png';
    else if (lowerSentimento === 'neutra') src = '/images/emotions/Meh.png';
    else if (lowerSentimento === 'negativa') src = '/images/emotions/Sad.png';
    else return <FaSmile className="text-gray-500 dark:text-gray-400 w-5 h-5" />;

    return (
      <Image
        src={src}
        alt={sentimento}
        width={20}
        height={20}
        className="w-5 h-5"
      />
    );
  };

  const getStatusBgColor = (status: string | undefined) => {
    const lowerStatus = status ? status.toLowerCase() : '';

    if (lowerStatus === 'em aberto' || lowerStatus === 'em andamento') return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300";
    if (lowerStatus === 'pendente' || lowerStatus === 'aguardando pelo suporte' || lowerStatus === 'itens pendentes') return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300';
    if (lowerStatus === 'concluido' || lowerStatus === 'concluído' || lowerStatus === 'concluída' || lowerStatus === 'resolvido' || lowerStatus === 'fechado') return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';

    return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
  };

  const getIconColor = () => 'text-gray-600 dark:text-gray-400';

  const handleCardClick = () => {
    if (chamado.id_importado) {
      router.push(`/chamados/${chamado.id_importado}`);
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            Chamado: {chamado.id_importado || chamado.id}
          </h3>
          {getSentimentoEmoji(chamado.sentimento_cliente)}
        </div>
        {chamado.status && (
          <span
            className={`${getStatusBgColor(
              chamado.status
            )} text-xs font-semibold px-2 py-1 rounded-full`}
          >
            {chamado.status}
          </span>
        )}
      </div>
      <h4 className="font-bold text-md text-gray-900 dark:text-gray-100 break-words">
        Título: {chamado.titulo || 'Sem título'}
      </h4>
      <div className="flex items-center gap-2 text-sm text-black-600 dark:text-gray-300">
        {chamado.tipo_importacao && (
          <span className="font-bold">{chamado.tipo_importacao}</span>
        )}

        {chamado.data_abertura && <FaClock className={getIconColor()} />}
        <span>
          {chamado.data_abertura
            ? formatarDataSimples(chamado.data_abertura)
            : 'Sem data'}
        </span>
        {chamado.responsavel && (
          <span>
            Responsável: <br />
            {chamado.responsavel}
          </span>
        )}
      </div>
    </div>
  );
};

export default CardHome;