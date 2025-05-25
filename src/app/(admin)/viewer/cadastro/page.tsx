"use client";

import React, { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/form-elements/SelectInputs";
import { ChevronDownIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";

interface Usuario {
  nome: string;
  email: string;
  senha: string;
  papel: "admin" | "viewer";
}

interface Props {
  onSubmit: (usuario: Usuario) => void;
}

const CadastroUsuarioPage = ({ onSubmit }: Props) => {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: "",
    email: "",
    senha: "",
    papel: "viewer",
  });

  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const { isOpen, openModal, closeModal } = useModal(false);

  const papeis = [
    { value: "viewer", label: "Viewer (Apenas visualização)" },
    { value: "admin", label: "Admin (Acesso completo)" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setUsuario(prev => ({ ...prev, papel: value as "admin" | "viewer" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuario.senha !== confirmarSenha) {
      openModal();
      return;
    }
    onSubmit(usuario);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:text-xl">
            Cadastrar Novo Usuário Viewer
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nome Completo */}
            <div>
              <Label>Nome Completo:</Label>
              <Input
                name="nome"
                type="text"
                placeholder="Digite o nome completo"
                onChange={handleChange}
                className="w-full dark:bg-gray-800 dark:border-gray-700"

              />
            </div>

            {/* Email */}
            <div>
              <Label >E-mail:</Label>
              <Input
                name="email"
                type="email"
                placeholder="exemplo@dominio.com"
                onChange={handleChange}
                className="w-full dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            {/* Senha */}
            <div>
              <Label >Senha:</Label>
              <div className="relative">
                <Input
                  name="senha"
                  type={senhaVisivel ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setSenhaVisivel(!senhaVisivel)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {senhaVisivel ? (
                    <EyeCloseIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <Label >Confirmar Senha:</Label>
              <div className="relative">
                <Input
                  type={senhaVisivel ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setSenhaVisivel(!senhaVisivel)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {senhaVisivel ? (
                    <EyeCloseIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label>Perfil:</Label>
              <select
                name="perfil"
                value={usuario.papel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <Button
              className="bg-[#00163B] hover:bg-[#001e4f] dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Cadastrar Usuário
            </Button>
          </div>
        </form>
      </div>

      {/* Modal de Erro */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
        <div className="p-5 text-center">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Senhas não coincidem!
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
};

// Componentes de ícone fictícios - substitua pelos seus próprios
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeCloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default CadastroUsuarioPage;