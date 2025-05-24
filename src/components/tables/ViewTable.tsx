"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";

interface Viewer {
  id: number;
  name: string;
  role: string;
  email: string;
  status: "ativo" | "inativo";
  chamados: number;
  lastActivity: string;
}

export default function ViewersTable() {
  const [viewers, setViewers] = useState<Viewer[]>([
    {
      id: 1,
      name: "Carlos Silva",
      role: "Admin",
      email: "carlos.silva@empresa.com",
      status: "ativo",
      chamados: 12,
      lastActivity: "2023-05-15",
    },
    {
      id: 2,
      name: "Ana Oliveira",
      role: "Viewer",
      email: "ana.oliveira@empresa.com",
      status: "ativo",
      chamados: 8,
      lastActivity: "2023-05-18",
    },
    {
      id: 3,
      name: "Pedro Santos",
      role: "Viewer",
      email: "pedro.santos@empresa.com",
      status: "inativo",
      chamados: 3,
      lastActivity: "2023-04-28",
    },
    {
      id: 4,
      name: "Mariana Costa",
      role: "Viewer",
      email: "mariana.costa@empresa.com",
      status: "ativo",
      chamados: 15,
      lastActivity: "2023-05-20",
    },
    {
      id: 5,
      name: "Rafael Pereira",
      role: "Viewer",
      email: "rafael.pereira@empresa.com",
      status: "inativo",
      chamados: 5,
      lastActivity: "2023-05-10",
    },
   ]);

  const toggleStatus = (id: number) => {
    setViewers(prevViewers =>
      prevViewers.map(viewer =>
        viewer.id === id
          ? {
              ...viewer,
              status: viewer.status === "ativo" ? "inativo" : "ativo",
            }
          : viewer
      )
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Remova a div com overflow-x-auto e min-w-[1102px] */}
      <Table className="w-full"> {/* Adicione w-full aqui */}
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Nome
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Cargo
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              E-mail
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
              Chamados
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Última Atividade
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Ações
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {viewers.map((viewer) => (
            <TableRow key={viewer.id}>
              <TableCell className="px-5 py-4 text-start">
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {viewer.name}
                </span>
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {viewer.role}
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {viewer.email}
              </TableCell>
              <TableCell className="px-5 py-4 text-start">
                <Badge
                  size="sm"
                  color={viewer.status === "ativo" ? "success" : "error"}
                >
                  {viewer.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                {viewer.chamados}
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                {viewer.lastActivity}
              </TableCell>
              <TableCell className="px-5 py-4 text-start">
                <Button
                  variant="outline"
                  onClick={() => toggleStatus(viewer.id)}
                  className={
                    viewer.status === "ativo"
                      ? "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                  }
                >
                  {viewer.status === "ativo" ? "Desativar" : "Ativar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}