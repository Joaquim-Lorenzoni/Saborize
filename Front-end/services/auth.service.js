/**
 * Serviço de Autenticação
 * 
 * Gerencia login, registro, logout e token JWT
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './api.service';
import { API_ENDPOINTS, TOKEN_KEY, USER_KEY } from '../config/api';

const authService = {
  /**
   * Login de usuário
   * 
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário e token
   */
  login: async (email, password) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      
      // Salvar token e dados do usuário
      if (response.token) {
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
      }
      
      if (response.user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  /**
   * Registro de novo usuário
   * 
   * @param {Object} userData - Dados do usuário (name, email, password, etc.)
   * @returns {Promise<Object>} Dados do usuário criado
   */
  register: async (userData) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.REGISTER, userData);
      
      // Salvar token e dados do usuário (se o backend retornar)
      if (response.token) {
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
      }
      
      if (response.user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  /**
   * Logout do usuário
   * Remove token e dados do AsyncStorage
   */
  logout: async () => {
    try {
      // Chamar endpoint de logout no backend (opcional)
      try {
        await apiService.post(API_ENDPOINTS.LOGOUT);
      } catch (error) {
        // Ignorar erro do logout no backend
        console.warn('Erro ao fazer logout no backend:', error);
      }
      
      // Remover token e dados do usuário
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },

  /**
   * Verificar se usuário está autenticado
   * 
   * @returns {Promise<boolean>} True se tiver token válido
   */
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  },

  /**
   * Obter token armazenado
   * 
   * @returns {Promise<string|null>} Token JWT ou null
   */
  getToken: async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      return null;
    }
  },

  /**
   * Obter dados do usuário armazenados
   * 
   * @returns {Promise<Object|null>} Dados do usuário ou null
   */
  getCurrentUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  },

  /**
   * Atualizar dados do usuário no AsyncStorage
   * 
   * @param {Object} userData - Novos dados do usuário
   */
  updateCurrentUser: async (userData) => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
};

export default authService;

