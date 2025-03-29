"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface DetalhesChamadoProps {
  chamado: {
    id: number;
    status: string;
    sentimento: string;
    responsavel: string;
    tipo_importacao: string;
    data_abertura: string;
    ultima_atualizacao: string;
    titulo?: string;
    descricao?: string;
    comentarios?: { usuario: string; hora: string; mensagem: string }[];
  };
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Não definida";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
    return date.toLocaleDateString("pt-BR");
  } catch (error) {
    return "Erro na data";
  }
};

const DetalhesChamado: React.FC<DetalhesChamadoProps> = ({ chamado }) => {
  const router = useRouter();

  return (
    <div className="p-6 bg-gray-200 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <button onClick={() => router.back()} className="text-gray-700 text-sm mb-4">
          ← VOLTAR
        </button>
      </div>

      <div className="bg-blue-100 shadow-lg rounded-lg p-4 w-full max-w-3xl border border-gray-300">
        <h2 className="text-xl font-bold text-black">
          Chamado [{chamado.id}]
        </h2>
        <div className="flex justify-between mt-2">
          <div className="flex space-x-2">
            <button className="px-4 py-1 bg-white border rounded-md text-black">
              STATUS
            </button>
            <button className="px-4 py-1 bg-white border rounded-md text-black">
              SENTIMENTO
            </button>
            <button className="px-4 py-1 bg-white border rounded-md text-black">
              SUB-SENTIMENTO
            </button>
          </div>
          <div className="text-sm text-gray-700">
            <p>Data início: {formatDate(chamado.data_abertura)}</p>
            <p>Data fim: Em andamento</p>
            <p>Responsável: {chamado.responsavel || "Não atribuído"}</p>
            <p>Tipo: {chamado.tipo_importacao || "Não categorizado"}</p>
          </div>
        </div>
      </div>

      {/* Descrição */}
      <div className="bg-blue-100 shadow-md rounded-lg p-4 mt-4 w-full max-w-3xl border border-gray-300">
        <p className="text-gray-700">
          {chamado.descricao ||
            "Nenhuma descrição disponível para este chamado."}
        </p>
      </div>

      <div className="bg-gray-200 shadow-md rounded-lg p-4 mt-4 w-full max-w-3xl border border-gray-300 overflow-y-auto max-h-60">
        {chamado.comentarios && chamado.comentarios.length > 0 ? (
          chamado.comentarios.map((comentario, index) => (
            <div key={index} className="mb-2 border-b pb-2">
              <p className="text-sm font-bold">@{comentario.usuario} {comentario.hora}</p>
              <p className="text-gray-700">{comentario.mensagem}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhum comentário disponível.</p>
        )}
      </div>
    </div>
  );
};

export default DetalhesChamado;
