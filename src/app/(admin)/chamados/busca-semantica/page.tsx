"use client";

import React, { useState, useEffect } from "react";
import CardChamados from "@/components/chamados/listagemChamados/listagemChamados";

import { useSearchParams } from "next/navigation";
import { buscaSemantica } from "@/services/service";

interface Chamado {
  id: number;
  status: string;
  sentimento_cliente: string;
  responsavel: string;
  tipo_importacao: string;
  data_abertura: string;
  ultima_atualizacao: string;
  titulo?: string;
  id_importado?: string;
  tipo_documento?: string;
}

const tamanhoPagina = 10;

const RelatorioChamados = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const prompt = query || "chamados";

  const [isLoading, setIsLoading] = useState(true);
  const [calls, setCalls] = useState<Chamado[]>([]);
  const [pagina, setPagina] = useState(1);
  const [token, setToken] = useState<string | null>(null);
  const [totalChamados, setTotalChamados] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const totalPaginas = Math.ceil(totalChamados / tamanhoPagina);

  useEffect(() => {
    setPagina(1); // resetar página ao mudar o prompt
    setToken(null); // limpar token para nova busca
  }, [prompt]);

  useEffect(() => {
    fetchChamados();
  }, [pagina, token, prompt]);

  const fetchChamados = async () => {
    setIsLoading(true);
    try {
      const result = await buscaSemantica(prompt, pagina, tamanhoPagina, token || "");
      setCalls(result.resultados);
      setToken(result.token);
      setTotalChamados(result.total);
      setError(null);
      console.log("🔎 Resultado da busca:", result);
    } catch (err) {
      console.error("Erro ao buscar chamados:", err);
      setError("Erro ao carregar chamados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPaginas) {
      setPagina(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Relatório de Chamados
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Carregando chamados...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
            <p>{error}</p>
            <button
              onClick={fetchChamados}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#00163B] px-4 py-2 text-sm font-medium text-white hover:bg-[#001e4f]"
            >
              Tentar novamente
            </button>
          </div>
        ) : calls.length > 0 ? (
          <>
            <div className="space-y-4">
              {calls.map((chamado) => (
                <CardChamados
                  key={chamado.id}
                  chamado={{
                    id:
                      typeof chamado.id_importado === "string"
                        ? parseInt(chamado.id_importado, 10) || chamado.id
                        : chamado.id,
                    status: chamado.status,
                    sentimento: chamado.sentimento_cliente || "",
                    dataInicio: chamado.data_abertura || "",
                    dataFim: chamado.ultima_atualizacao || "",
                    responsavel: chamado.responsavel || "",
                    tipo: chamado.tipo_importacao || "",
                    tipo_documento: chamado.tipo_documento || "",
                    titulo: chamado.titulo || "",
                  }}
                />
              ))}
            </div>

            {/* Paginação */}
            {totalChamados > tamanhoPagina && (
              <div className="mt-6 flex justify-end">
                <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                  <button
                    onClick={() => handlePageChange(pagina - 1)}
                    disabled={pagina <= 1}
                    className={`px-3 py-1 rounded-md ${
                      pagina <= 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-500 hover:bg-blue-100"
                    }`}
                  >
                    Anterior
                  </button>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {pagina} de {totalPaginas}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagina + 1)}
                    disabled={pagina >= totalPaginas}
                    className={`px-3 py-1 rounded-md ${
                      pagina >= totalPaginas
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-500 hover:bg-blue-100"
                    }`}
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg bg-gray-100 p-4 text-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            Nenhum chamado encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatorioChamados;
