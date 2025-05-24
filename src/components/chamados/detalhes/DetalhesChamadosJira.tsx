"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaSmile, FaCommentDots, FaClock, FaUser } from "react-icons/fa";


interface DetalhesChamadoProps {
  chamado: any;
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Não definida";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Data inválida";
  }
};

const cleanMessage = (text: string) => {
  if (!text) return "Nenhuma mensagem disponível";

  try {
    return text
      .replace(/\{color\}/g, "")
      .replace(/\\/g, "")
      .replace(/\|/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } catch (error) {
    return text;
  }
};

const DetalhesChamadoJira: React.FC<DetalhesChamadoProps> = ({ chamado }) => {
  const router = useRouter();

  const periodoData = chamado.ultima_atualizacao
    ? `${formatDate(chamado.data_abertura)} - ${formatDate(chamado.ultima_atualizacao)}`
    : formatDate(chamado.data_abertura);

    const getSentimentoEmoji = (sentimento?: string) => {
      if (!sentimento || typeof sentimento !== 'string') return <FaSmile className="text-gray-500 dark:text-gray-400" />;
      const s = sentimento.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
      if (["positivo", "positiva"].includes(s)) return '😊';
      if (["neutro", "neutra"].includes(s)) return '😐';
      if (["negativo", "negativa"].includes(s)) return '😞';
      return <FaSmile className="text-gray-500 dark:text-gray-400" />;
    };

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        Voltar
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className="font-bold dark:text-white text-2xl">
            CHAMADO {chamado.id_importado || chamado.id}
          </h2>

          <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full">
            {chamado.status || "Sem status"}
          </span>
        </div>

        <div className="flex flex-wrap dark:text-white gap-6 mb-6">
          <div className="flex items-center gap-1">
              {getSentimentoEmoji(chamado.sentimento)}
              <span className="text-gray-700 dark:text-gray-300">{chamado.sentimento}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaCommentDots className="text-gray-600" />
            <span>{chamado.tipo_documento || "Não informado"}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaClock className="text-gray-600" />
            <span>{periodoData}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaUser className="text-gray-600" />
            <span>{chamado.responsavel || "Não atribuído"}</span>
          </div>
        </div>

        <span className="block w-full bg-cover dark:text-white text-right text-base">
          {chamado.tipo_importacao || "Não atribuído"}
        </span>

        <hr className="border-dashed border-gray-400 my-4" />

        <div className="text-center dark:text-white font-medium text-lg mb-6">
          {chamado.titulo || "Sem título"}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h4 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Sumarização</h4>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
            {chamado.sumarizacao}
          </pre>
        </div>
      </div>

      {/* Mensagem */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h4 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Mensagem</h4>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
            {cleanMessage(chamado.mensagem_limpa)}
          </pre>
        </div>
      </div>

      {/* Comentários */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h4 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Comentários</h4>
        {chamado.comentarios && chamado.comentarios.length > 0 ? (
          <div className="space-y-4">
            {chamado.comentarios.map((comentario: string, index: number) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">{comentario}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nenhum comentário disponível
          </p>
        )}
      </div>
    </div>
  );
};

export default DetalhesChamadoJira;
