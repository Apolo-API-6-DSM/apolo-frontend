"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { FaSmile, FaCommentDots, FaClock, FaUser } from "react-icons/fa";

interface CardSimplesProps {
  chamado: {
    id: number | string;
    status?: string;
    sentimento?: string;
    dataInicio?: string;
    dataFim?: string;
    responsavel?: string;
    tipo?: string;
    titulo?: string;
  };
}


const CardSimples: React.FC<CardSimplesProps> = ({ chamado }) => {
  const router = useRouter();
  
  const handleVerMais = () => {
    router.push(`/chamados/${chamado.id}`);
  };

  const formatarData = (dataISO: string | undefined) => {
    if (!dataISO) return '';
    try {
      const data = new Date(dataISO);
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dataISO;
    }
  };

  const getSentimentoEmoji = (sentimento: string | undefined) => {
    if (!sentimento) return null;
    const lowerSentimento = sentimento.toLowerCase();
    if (lowerSentimento === 'positiva') return '😊';
    if (lowerSentimento === 'neutra') return '😐';
    if (lowerSentimento === 'negativa') return '😞';
    return null;
  };

  return (
    <div className="rounded-md hover:shadow-lg cursor-pointer border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.05]" onClick={handleVerMais}>
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          CHAMADO {chamado.id} {getSentimentoEmoji(chamado.sentimento)}
        </h5>
        {chamado.status && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            {chamado.status.toUpperCase()}
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 space-y-1">
        <div className="flex items-center space-x-10">
          {chamado.dataInicio && (
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatarData(chamado.dataInicio)}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>{chamado.status}</span>
          </div>
          {chamado.responsavel && (
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{chamado.responsavel}</span>
            </div>
          )}
        </div>
        {chamado.dataFim && (
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatarData(chamado.dataFim)}</span>
          </div>
        )}
      </div>
      {chamado.titulo && (
        <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
          <p className="text-sm italic text-gray-500 dark:text-gray-400 text-center">
            -------------------- Título --------------------
          </p>
          <p className="text-base font-medium text-gray-800 dark:text-white/90 text-center truncate">
            {chamado.titulo}
          </p>
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {chamado.tipo}
        </span>
      </div>
    </div>
  );
};

export default CardSimples;