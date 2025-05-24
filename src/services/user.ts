// src/services/user.ts
import api from './api';

export const userService = {
  getCurrentUser: async () => {
    try {
      const response = await api.get('/usuarios/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  updateUser: async (userId: string, data: { nome?: string; email?: string; telefone?: string; bio?: string }) => {
    try {
      const response = await api.patch(`/usuarios/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const response = await api.get(`/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  changePassword: async (userId: string, data: { currentPassword: string; newPassword: string }) => {
    const response = await api.patch(`/usuarios/${userId}/senha`, {
      senhaAtual: data.currentPassword,
      novaSenha: data.newPassword
    });
    return response.data;
  },

  criarUsuario: async (data: {
    nome: string;
    email: string;
    senha: string;
    papel: string;
    status: boolean;
  }) => {
    const response = await api.post('/usuarios', {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      papel: data.papel,
    });
    return response.data;
  },

  listarUsuarios: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  toggleStatus: async (userId: string) => {
    const response = await api.patch(`/usuarios/${userId}/status`);
    return response.data;
  },

  changePasswordAdmin: async (userId: string, newPassword: string) => {
    const response = await api.patch(`/usuarios/${userId}/senha-admin`, {
        novaSenha: newPassword
    });
    return response.data;
    },

};