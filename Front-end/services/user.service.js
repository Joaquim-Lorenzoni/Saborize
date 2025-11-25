/**
 * Serviço de Usuário
 * 
 * Gerencia dados do usuário e preferências
 */

import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

const userService = {
  /**
   * Obter dados do usuário atual
   * 
   * @returns {Promise<Object>} Dados do usuário (nome, email, preferências)
   */
  getCurrentUser: async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.USER_ME);
      return response;
    } catch (error) {
      // Não logar erro se for 401 (não autenticado) - é esperado após logout
      if (error.status === 401) {
        if (__DEV__) {
          console.warn('⚠️ Usuário não autenticado ao buscar dados');
        }
      } else {
        console.error('Erro ao buscar dados do usuário:', error);
      }
      throw error;
    }
  },

  /**
   * Atualizar preferências do usuário
   * 
   * @param {Object} preferences - Preferências a serem atualizadas
   * @param {boolean} preferences.notificationsEnabled - Notificações habilitadas
   * @param {boolean} preferences.darkModeEnabled - Modo escuro habilitado
   * @param {string} preferences.fontSize - Tamanho da fonte (SMALL, MEDIUM, LARGE)
   * @param {string} preferences.preferredCurrency - Moeda preferida (BRL, USD, EUR)
   * @returns {Promise<Object>} Preferências atualizadas
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await apiService.put(API_ENDPOINTS.USER_PREFERENCES, preferences);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      throw error;
    }
  },

  /**
   * Obter moeda preferida do usuário
   * 
   * @returns {Promise<string>} Código da moeda (BRL, USD, etc.)
   */
  getPreferredCurrency: async () => {
    try {
      const user = await userService.getCurrentUser();
      return user.preferredCurrency || 'BRL';
    } catch (error) {
      // Não logar erro se for apenas falta de autenticação ou dados não disponíveis
      // Retornar BRL como padrão silenciosamente
      if (__DEV__) {
        console.warn('⚠️ Não foi possível buscar moeda preferida, usando BRL como padrão:', error.message);
      }
      return 'BRL'; // Default
    }
  },
};

export default userService;

