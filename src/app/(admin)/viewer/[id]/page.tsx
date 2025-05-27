"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user";
import Badge from "@/components/ui/badge/Badge";
import { useParams } from "next/navigation";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: 'admin' | 'viewer';
  status: boolean;
  quantidadeChamados?: number;
  ultimaAtividade?: string;
}

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [usuario, setUsuario] = useState<Usuario>({
    id: '',
    nome: '',
    email: '',
    papel: 'viewer',
    status: true
  });
  
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { isOpen, openModal, closeModal } = useModal(false);

  // Carrega os dados do usuário
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getUserById(userId);
        setUsuario({
          ...userData,
          status: userData.status
        });
      } catch (err) {
        setError("Erro ao carregar dados do usuário");
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");
      
      // Atualiza dados básicos
      await userService.updateUser(usuario.id, {
        nome: usuario.nome,
        email: usuario.email
      });

      setSuccess("Usuário atualizado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setError("Erro ao atualizar usuário");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (novaSenha !== confirmarSenha) {
      openModal();
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Como é admin, podemos usar um endpoint especial ou mockar a senha atual
      await userService.changePassword(usuario.id, {
        currentPassword: "admin_override", // Isso precisaria ser tratado no backend
        newPassword: novaSenha
      });
      
      setSuccess("Senha alterada com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
      setNovaSenha("");
      setConfirmarSenha("");
      closeModal();
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      setError("Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !usuario.id) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:text-xl">
            Editar Usuário: {usuario.nome}
          </h3>
          <Badge 
            color={usuario.status ? "success" : "error"}
            size="sm"
          >
            {usuario.status ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nome Completo */}
            <div>
              <Label>Nome Completo</Label>
              <Input
                name="nome"
                type="text"
                defaultValue={usuario.nome}
                onChange={handleChange}
                className="w-full dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            {/* Email */}
            <div>
              <Label>E-mail</Label>
              <Input
                name="email"
                type="email"
                defaultValue={usuario.email}
                onChange={handleChange}
                className="w-full dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            {/* Perfil */}
            <div>
              <Label>Perfil</Label>
              {usuario.papel === 'viewer' && (
                <select
                  name="papel"
                  value={usuario.papel}
                  className="dark:text-white w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="viewer">Visualizador</option>
                </select>
              )}
              {usuario.papel === 'admin' && (
                <select
                  name="papel"
                  value={usuario.papel}
                  className="dark:text-white w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="admin">Administrador</option>
                </select>
              )}
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              {usuario.status && (
                <select
                  name="status"
                  value="ativo"
                  onChange={(e) =>
                    setUsuario((prev) => ({
                      ...prev,
                      status: e.target.value === "ativo",
                    }))
                  }
                  className="dark:text-white w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="ativo">Ativo</option>
                </select>
              )}
              {!usuario.status && (
                <select
                  name="status"
                  value="inativo"
                  onChange={(e) =>
                    setUsuario((prev) => ({
                      ...prev,
                      status: e.target.value === "ativo",
                    }))
                  }
                  className="dark:text-white w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="inativo">Inativo</option>
                </select>
              )}
            </div>

            {/* Estatísticas */}
            {usuario.quantidadeChamados !== undefined && (
              <div>
                <Label>Chamados Responsável</Label>
                <Input
                  type="text"
                  defaultValue={usuario.quantidadeChamados}
                  className="w-full dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            )}

            {usuario.ultimaAtividade && (
              <div>
                <Label>Última Atividade</Label>
                <Input
                  type="text"
                  defaultValue={usuario.ultimaAtividade}
                  className="w-full dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/viewer')}
            >
              Voltar
            </Button>
            <Button
              className="bg-[#00163B] hover:bg-[#001e4f] dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>

        {/* Seção de Alteração de Senha */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h4 className="text-md font-semibold mb-4 dark:text-white">Alterar Senha</h4>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label>Nova Senha</Label>
              <div className="relative">
                <Input
                  type={senhaVisivel ? "text" : "password"}
                  defaultValue={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setSenhaVisivel(!senhaVisivel)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {senhaVisivel ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div>
              <Label>Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  type={senhaVisivel ? "text" : "password"}
                  defaultValue={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setSenhaVisivel(!senhaVisivel)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {senhaVisivel ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handlePasswordChange}
              className="dark:text-white bg-[#00163B] hover:bg-[#001e4f] dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={loading || !novaSenha || novaSenha !== confirmarSenha}
            >
              Alterar Senha
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Erro - Senhas não coincidem */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
        <div className="p-5 text-center">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Senhas não coincidem
          </h4>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            As senhas digitadas não são iguais. Por favor, verifique e tente novamente.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={closeModal}
              className="bg-[#00163B] hover:bg-[#001e4f] dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Entendido
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}