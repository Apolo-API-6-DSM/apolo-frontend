"use client";
import React, { useEffect, useState } from "react";
import { userService } from "@/services/user";

interface User {
  nome?: string;
  papel?: string;
}

export default function UserMetaCard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">Carregando...</div>;
  }

  if (!user) {
    return <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">Erro ao carregar dados do usuário</div>;
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {user.nome || 'Usuário'}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.papel === 'admin' ? 'Administrador' : 'Visualizador'}
              </p>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
