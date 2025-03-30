"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface DetalhesChamadoProps {
  chamado: any; // Temporariamente usando any para debug
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
    console.error("Erro ao formatar data:", error, "Valor:", dateString);
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
    console.error("Erro ao limpar mensagem:", error);
    return text;
  }
};

const DetalhesChamado: React.FC<DetalhesChamadoProps> = ({ chamado }) => {
  const router = useRouter();

  console.log("Dados recebidos no DetalhesChamado:", chamado);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button 
        onClick={() => router.back()} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Voltar
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Detalhes do Chamado</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Informações Básicas</h2>
            <p><span className="font-medium">ID:</span> {chamado.id_importado || chamado.id}</p>
            <p><span className="font-medium">Título:</span> {chamado.titulo || "Sem título"}</p>
            <p><span className="font-medium">Status:</span> {chamado.status || "Não informado"}</p>
            <p><span className="font-medium">Sentimento:</span> {chamado.sentimento_cliente || "Não informado"}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Datas</h2>
            <p><span className="font-medium">Abertura:</span> {formatDate(chamado.data_abertura)}</p>
            <p><span className="font-medium">Última atualização:</span> {formatDate(chamado.ultima_atualizacao)}</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">Responsáveis</h2>
            <p><span className="font-medium">Responsável:</span> {chamado.responsavel || "Não atribuído"}</p>
            <p><span className="font-medium">Tipo:</span> {chamado.tipo_importacao || "Não informado"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Mensagem</h2>
        <div className="bg-gray-50 p-4 rounded">
          <pre className="whitespace-pre-wrap">{cleanMessage(chamado.mensagem_limpa)}</pre>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Comentários</h2>
        {chamado.comentarios && chamado.comentarios.length > 0 ? (
          <div className="space-y-4">
            {chamado.comentarios.map((comentario: any, index: number) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between">
                  <p className="font-medium text-blue-600">@{comentario.usuario}</p>
                  <p className="text-sm text-gray-500">{formatDate(comentario.hora)}</p>
                </div>
                <p className="mt-2">{comentario.mensagem}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum comentário disponível</p>
        )}
      </div>
    </div>
  );
};

export default DetalhesChamado;