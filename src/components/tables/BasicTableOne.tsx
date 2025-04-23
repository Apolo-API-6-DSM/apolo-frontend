import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface Importacao {
  id: number;
  tipoArquivo: "Jira" | "Porto";
  nomeArquivo: string;
  dataImportacao: string;
  status: "Processando" | "Processado" | "Erro ao processar";
  quantidadeDados: number;
}

const importacoesData: Importacao[] = [
  {
    id: 1,
    tipoArquivo: "Jira",
    nomeArquivo: "Jira completo ano 2021",
    dataImportacao: "2023-10-15T14:30:00",
    status: "Processado",
    quantidadeDados: 1000,
  },
  {
    id: 2,
    tipoArquivo: "Porto",
    nomeArquivo: "Porto completo ano 2021",
    dataImportacao: "2023-10-16T09:15:00",
    status: "Processando",
    quantidadeDados: 500,
  },
  {
    id: 3,
    tipoArquivo: "Jira",
    nomeArquivo: "Jira completo ano 2022",
    dataImportacao: "2023-10-17T16:45:00",
    status: "Erro ao processar",
    quantidadeDados: 1000,
  },
  {
    id: 4,
    tipoArquivo: "Porto",
    nomeArquivo: "Porto completo ano 2022",
    dataImportacao: "2023-10-18T11:20:00",
    status: "Processado",
    quantidadeDados: 500,
  },
  {
    id: 5,
    tipoArquivo: "Jira",
    nomeArquivo: "Jira completo ano 2023",
    dataImportacao: "2023-10-19T13:10:00",
    status: "Processando",
    quantidadeDados: 1000,
  },
];

export default function BasicTableOne() {
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {importacoesData.map((importacao) => (
              <TableRow key={importacao.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white/90">
                  {importacao.tipoArquivo}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white/90">
                  {importacao.nomeArquivo}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-gray-400">
                  {formatarData(importacao.dataImportacao)}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <Badge
                    size="sm"
                    color={
                      importacao.status === "Processado"
                        ? "success"
                        : importacao.status === "Processando"
                        ? "default"
                        : "error"
                    }
                  >
                    {importacao.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-gray-400">
                  {importacao.quantidadeDados.toLocaleString('pt-BR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}