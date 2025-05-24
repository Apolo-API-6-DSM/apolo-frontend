// src/services/user.ts
import api from './api';

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/usuarios/me');
    return response.data;
  },

  updateUser: async (userId: string, data: { nome?: string; email?: string; telefone?: string; bio?: string }) => {
    const response = await api.patch(`/usuarios/${userId}`, data);
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await api.get(`/usuarios/${userId}`);
    return response.data;
  }
};