"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { fetchArquivosInfo } from "@/services/service";
import { useRouter } from "next/navigation"; // Alterado para next/navigation
import { ArrowRight } from "lucide-react";

interface ArquivoInfo {
  "Tipo de Arquivo": string;
  "Nome de Arquivo": string;
  "Data da Importação": string;
  "Status": string;
  "Quantidade de Dados": number;
  "nomeArquivoId"?: number;
}

export default function BasicTableOne() {
  const [arquivos, setArquivos] = useState<ArquivoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const carregarArquivos = async () => {
      const { success, data, error } = await fetchArquivosInfo();
      
      if (success) {
        setArquivos(data);
      } else {
        setError(error);
      }
      setLoading(false);
    };

    carregarArquivos();
  }, []);

  const normalizeStatus = (status: string | undefined): string => {
    if (!status) return "DESCONHECIDO";
    
    const s = status
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .toUpperCase();

    if (s === "CONCLUIDO") return "CONCLUÍDO";
    if (s === "PROCESSANDO") return "PROCESSANDO";
    if (s === "ERRO" || s === "FALHA") return "ERRO";
    
    return status;
  };

  const handleVerChamados = (nomeArquivoId: number | undefined) => {
    if (!nomeArquivoId) {
      console.error('ID do arquivo não está disponível');
      return;
    }
    router.push(`/chamados/listagem?nomeArquivoId=${nomeArquivoId}`);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tipo de Arquivo
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nome de Arquivo
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Data da Importação
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Quantidade de Dados
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {arquivos.map((arquivo, index) => (
              <TableRow key={index}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white/90">
                  {arquivo["Tipo de Arquivo"]}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white/90">
                  {arquivo["Nome de Arquivo"]}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-gray-400">
                  {arquivo["Data da Importação"]}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <Badge
                    size="sm"
                    color={
                      normalizeStatus(arquivo["Status"]) === "CONCLUÍDO"
                        ? "success"
                        : normalizeStatus(arquivo["Status"]) === "PROCESSANDO"
                        ? "warning" // ou "info" ou "primary" dependendo do seu design
                        : "error"
                    }
                  >
                    {normalizeStatus(arquivo["Status"])}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-gray-400">
                  {arquivo["Quantidade de Dados"].toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                <button 
                  onClick={() => {
                    if (arquivo.nomeArquivoId !== undefined) {
                      handleVerChamados(arquivo.nomeArquivoId);
                    }
                  }}
                  className={`flex items-center ${
                    arquivo.nomeArquivoId !== undefined
                      ? 'text-blue-500 hover:text-blue-700 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={arquivo.nomeArquivoId === undefined}
                >
                  Ver chamados <ArrowRight className="ml-1 h-4 w-4" />
                </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}