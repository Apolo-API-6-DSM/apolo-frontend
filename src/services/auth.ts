// src/services/auth.ts
import api from './api';

export const auth = {
  login: async (email: string, senha: string) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      localStorage.setItem('access_token', response.data.access_token);
      return response.data;
    } catch {
      throw new Error('Credenciais inválidas');
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  isAuthenticated: () => {
    const token = auth.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
  
  getUserInfo: () => {
    const token = auth.getToken();
    if (!token) return null;
    
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
};