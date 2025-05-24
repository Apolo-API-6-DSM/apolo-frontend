"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { userService } from "@/services/user";
import { auth } from "@/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Usuario {
  id: string;
  nome: string;
  papel: 'admin' | 'viewer';
  email: string;
  status: "ativo" | "inativo";
  quantidadeChamados: number;
}

export default function UsuariosTable() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const userInfo = auth.getUserInfo();
        if (!userInfo || userInfo.papel !== 'admin') {
          router.push('/unauthorized');
          return;
        }

        const data = await userService.listarUsuarios();
        setUsuarios(data);
      } catch (err) {
        setError("Erro ao carregar lista de usuários");
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsuarios();
  }, [router]);

  // Função para processar os dados como no exemplo
  const processData = (usuarios: Usuario[]) => {
    // Aqui você pode adicionar processamento adicional se necessário
    return usuarios;
  };

  const toggleStatus = async (id: string) => {
    try {
      const updatedUser = await userService.toggleStatus(id);
      setUsuarios(prevUsuarios =>
        prevUsuarios.map(usuario =>
          usuario.id === id
            ? {
                ...usuario,
                status: updatedUser.status ? 'ativo' : 'inativo',
              }
            : usuario
        )
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
      setError("Erro ao alterar status do usuário");
    }
  };

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const processedUsuarios = processData(usuarios);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <Table className="w-full">
        {/* Cabeçalho da tabela */}
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Nome
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Cargo
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              E-mail
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Status
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Chamados
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Ações
            </TableCell>
          </TableRow>
        </TableHeader>

        {/* Corpo da tabela */}
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {processedUsuarios.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell className="px-5 py-4 text-start">
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {usuario.nome}
                </span>
              </TableCell>
              <TableCell className="px-5 py-4 text-start">
                <Badge
                  size="sm"
                >
                  {usuario.papel === 'admin' ? 'Administrador' : 'Visualizador'}
                </Badge>
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {usuario.email}
              </TableCell>
              <TableCell className="px-5 py-4 text-start">
                <Badge
                  size="sm"
                  color={usuario.status === "ativo" ? "success" : "error"}
                >
                  {usuario.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                {usuario.quantidadeChamados}
              </TableCell>
              <TableCell className="px-5 py-4 text-start space-x-2">
                <Link href={`/viewer/${usuario.id}`} passHref>
                  <Button variant="outline" size="sm">
                    Ver Perfil
                  </Button>
                </Link>
                {usuario.papel === 'viewer' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(usuario.id)}
                    className={
                      usuario.status === "ativo"
                        ? "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        : "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                    }
                  >
                    {usuario.status === "ativo" ? "Desativar" : "Ativar"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}