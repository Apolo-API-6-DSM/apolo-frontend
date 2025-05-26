"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSmile, FaCommentDots, FaClock, FaUser } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

interface DetalhesChamadoProps {
  chamado: any;
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Não definida";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida!";

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
  if (!text) return "Nenhuma mensagem disponível.";

  try {
    return text
      // Remove todas as variações da palavra 'color' (case insensitive)
      .replace(/\bcolor\b/gi, '')
      // Remove outros padrões indesejados
      .replace(/\{color\}/g, '')
      .replace(/\\/g, '')
      .replace(/\|/g, ' ')
      // Remove múltiplos espaços em branco
      .replace(/\s+/g, ' ')
      // Remove espaços no início e fim
      .trim()
      // Remove pontuação estranha que possa ter sobrado
      .replace(/^\W+/, '')
      .replace(/\W+$/, '')
      // Capitaliza a primeira letra
      .replace(/^./, (match) => match.toUpperCase());
  } catch (error) {
    return text;
  }
};

const getUserRole = (): string | null => {
  if (typeof window === "undefined") return null;
  
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.papel || null;
  } catch {
    return null;
  }
};

const DetalhesChamadoJira: React.FC<DetalhesChamadoProps> = ({ chamado }) => {
  const router = useRouter();
  useAuth(); // Adiciona a verificação de autenticação
  
  const userRole = getUserRole();
  const isAdmin = userRole === 'admin';

  const normalizeStatus = (status: string | undefined): string => {
    if (!status) return "Sem status";

    const normalized = status
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

    if (normalized === "CONCLUIDO") return "CONCLUÍDO";
    if (normalized === "EM ABERTO") return "EM ABERTO";
    return status.toUpperCase();
  };

  const getStatusColorClass = (status: string | undefined): string => {
    const s = status
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim();

    if (s === "EM ABERTO") {
      return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300";
    }

    if (s === "CONCLUIDO") {
      return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300";
    }

    return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
  };

  const periodoData = chamado.ultima_atualizacao
    ? `${formatDate(chamado.data_abertura)} - ${formatDate(chamado.ultima_atualizacao)}`
    : formatDate(chamado.data_abertura);

  const getSentimentoEmoji = (sentimento?: string) => {
    if (!sentimento || typeof sentimento !== 'string') {
      return <FaSmile className="text-gray-500 dark:text-gray-400 w-5 h-5" />;
    }

    const s = sentimento.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    let src = '';

    if (["positivo", "positiva"].includes(s)) src = '/images/emotions/Happy.png';
    else if (["neutro", "neutra"].includes(s)) src = '/images/emotions/Meh.png';
    else if (["negativo", "negativa"].includes(s)) src = '/images/emotions/Sad.png';
    else return <FaSmile className="text-gray-500 dark:text-gray-400 w-5 h-5" />;

    return <img src={src} alt={sentimento} className="w-5 h-5" />;
  };

  const getTipoImportacaoColorClass = (tipo: string | undefined): string => {
    if (!tipo) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    
    const normalizedTipo = tipo.toLowerCase().trim();
    
    if (normalizedTipo === "jira") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
    
    if (normalizedTipo === "alternativo") {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    }
    
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const formatarSentimento = (sentimento_cliente?: string) => {
    if (!sentimento_cliente) return '';
    
    const s = sentimento_cliente.toLowerCase();
    
    if (s === 'positiva') return 'Positivo';
    if (s === 'negativa') return 'Negativo';
    if (s === 'neutra') return 'Neutro';
    
    return sentimento_cliente.charAt(0).toUpperCase() + sentimento_cliente.slice(1).toLowerCase();
  };

  useEffect(() => {
    console.log("Dados do chamado:", chamado);
  }, [chamado]);

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

          <span
            className={`${getStatusColorClass(chamado.status)} text-xs font-semibold px-4 py-2 rounded-full`}
          >
            {normalizeStatus(chamado.status) || "Sem status"}
          </span>
        </div>

        <div className="flex flex-wrap dark:text-white gap-6 mb-6">
          <div className="flex items-center gap-1">
            {getSentimentoEmoji(chamado.sentimento_cliente)}
            <span className="text-gray-700 dark:text-gray-300">
              {formatarSentimento(chamado.sentimento_cliente) || "Não informado"}
            </span>
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

        <span className={`block w-full py-2 px-3 rounded-lg text-center text-base font-medium ${getTipoImportacaoColorClass(chamado.tipo_importacao)}`}>
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
        <h4 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">
          {isAdmin ? "Mensagem Completa (Admin)" : "Mensagem Processada (Viewer)"}
        </h4>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
            {isAdmin 
              ? cleanMessage(chamado.mensagem_limpa) 
              : cleanMessage(chamado.descricao_dataset)}
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
