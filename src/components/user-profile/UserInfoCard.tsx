"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { userService } from "@/services/user";
import { auth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { ChangePasswordModal } from "../alteracaoSenha/ChangePasswordModal";

export default function UserInfoCard() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: ''
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
        setFormData({
          nome: userData.nome || '',
          email: userData.email || '',
        });
      } catch (error) {
        console.error("Failed to load user data:", error);
        setError("Erro ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!user) return;
      
      const updatedUser = await userService.updateUser(user.id, formData);
      setUser(updatedUser);
      closeModal();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  if (loading) {
    return <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">Carregando...</div>;
  }

  if (!user) {
    return <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">Erro ao carregar dados do usuário</div>;
  }

  const canEdit = auth.getUserInfo()?.papel === 'admin' || auth.getUserInfo()?.id === user.id;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informações Pessoais
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nome
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.nome || 'Não informado'}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Editar
          </button>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6667 8.66667H12V8H11.3333V6.66667C11.3333 4.82572 9.84095 3.33333 8 3.33333C6.15905 3.33333 4.66667 4.82572 4.66667 6.66667V8H4V8.66667H3.33333V14H12.6667V8.66667ZM8 10C7.63181 10 7.33333 9.70152 7.33333 9.33333C7.33333 8.96514 7.63181 8.66667 8 8.66667C8.36819 8.66667 8.66667 8.96514 8.66667 9.33333C8.66667 9.70152 8.36819 10 8 10ZM5.33333 6.66667C5.33333 5.5621 6.22876 4.66667 7.33333 4.66667H8.66667C9.77124 4.66667 10.6667 5.5621 10.6667 6.66667V8H5.33333V6.66667Z"
              fill="currentColor"
            />
          </svg>
          Alterar Senha
        </button>
      </div>

      {/* Adicione o modal de alteração de senha */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userId={user.id}
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edite Suas Informações Pessoais
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informações Pessoais
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nome</Label>
                    <Input 
                      type="text" 
                      name="nome"
                      defaultValue={formData.nome}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email</Label>
                    <Input 
                      type="text" 
                      name="email"
                      defaultValue={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Fechar
              </Button>
              <Button size="sm" onClick={handleSave}>
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}