"use client";

import React from "react";
import { useRouter } from "next/navigation";

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
      minute: "2-digit"
    });
  } catch (error) {
    return "Data inválida";
  }
};

const cleanMessage = (text: string) => {
  if (!text) return "Nenhuma mensagem disponível";
  
  try {
    return text
      .replace(/\{color\}/g, '')
      .replace(/\\/g, '')
      .replace(/\|/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (error) {
    return text;
  }
};

const DetalhesChamado: React.FC<DetalhesChamadoProps> = ({ chamado }) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <button 
        onClick={() => router.back()} 
        className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        Voltar
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Detalhes do Chamado
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-800 dark:text-white/90">Informações Básicas</h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><span className="font-medium">ID:</span> {chamado.id_importado || chamado.id}</p>
              <p><span className="font-medium">Título:</span> {chamado.titulo || "Sem título"}</p>
              <p><span className="font-medium">Status:</span> {chamado.status || "Não informado"}</p>
              <p><span className="font-medium">Sentimento:</span> {chamado.sentimento_cliente || "Não informado"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-800 dark:text-white/90">Datas e Responsáveis</h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><span className="font-medium">Abertura:</span> {formatDate(chamado.data_abertura)}</p>
              <p><span className="font-medium">Última atualização:</span> {formatDate(chamado.ultima_atualizacao)}</p>
              <p><span className="font-medium">Responsável:</span> {chamado.responsavel || "Não atribuído"}</p>
              <p><span className="font-medium">Tipo:</span> {chamado.tipo_importacao || "Não informado"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h4 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Mensagem</h4>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{cleanMessage(chamado.mensagem_limpa)}</pre>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h4 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Comentários</h4>
        {chamado.comentarios && chamado.comentarios.length > 0 ? (
          <div className="space-y-4">
            {chamado.comentarios.map((comentario: any, index: number) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 dark:border-gray-700">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">@{comentario.usuario}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comentario.hora)}</p>
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comentario.mensagem}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum comentário disponível</p>
        )}
      </div>
    </div>
  );
};

export default DetalhesChamado;