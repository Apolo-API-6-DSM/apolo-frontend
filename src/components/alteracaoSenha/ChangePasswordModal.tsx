// src/components/ChangePasswordModal.tsx
"use client";
import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { userService } from "@/services/user";
import { useRouter } from "next/navigation";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  userId 
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      await userService.changePassword(userId, {
        currentPassword,
        newPassword
      });
      setSuccess("Senha alterada com sucesso!");
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 1500);
    } catch (err) {
      setError("Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px]">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">Alterar Senha</h3>
        
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Senha Atual</Label>
              <Input
                type="password"
                defaultValue={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <Label>Nova Senha</Label>
              <Input
                type="password"
                defaultValue={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <Label>Confirmar Nova Senha</Label>
              <Input
                type="password"
                defaultValue={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};