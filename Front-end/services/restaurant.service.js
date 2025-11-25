/**
 * Serviço de Restaurantes
 * 
 * Gerencia operações com restaurantes (admin)
 */

import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

const restaurantService = {
  /**
   * Listar todos os restaurantes
   * 
   * @returns {Promise<Array>} Lista de restaurantes
   */
  getAllRestaurants: async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.WS_RESTAURANTS);
      return response;
    } catch (error) {
      console.error('Erro ao buscar restaurantes:', error);
      throw error;
    }
  },

  /**
   * Criar restaurante (Admin)
   * 
   * @param {Object} restaurantData - Dados do restaurante
   * @param {string} restaurantData.name - Nome do restaurante
   * @returns {Promise<Object>} Restaurante criado
   */
  createRestaurant: async (restaurantData) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.WS_RESTAURANTS, {
        name: restaurantData.name,
      });
      return response;
    } catch (error) {
      console.error('Erro ao criar restaurante:', error);
      throw error;
    }
  },

  /**
   * Associar restaurante a um plano
   * 
   * @param {number} planId - ID do plano
   * @param {number} restaurantId - ID do restaurante
   * @returns {Promise<Object>} Plano atualizado
   */
  associateWithPlan: async (planId, restaurantId) => {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.WS_ASSOCIATE_RESTAURANT(planId, restaurantId)
      );
      return response;
    } catch (error) {
      console.error(`Erro ao associar restaurante ${restaurantId} ao plano ${planId}:`, error);
      throw error;
    }
  },

  /**
   * Desassociar restaurante de um plano
   * 
   * @param {number} planId - ID do plano
   * @param {number} restaurantId - ID do restaurante
   * @returns {Promise<Object>} Plano atualizado
   */
  disassociateFromPlan: async (planId, restaurantId) => {
    try {
      const response = await apiService.delete(
        API_ENDPOINTS.WS_DISASSOCIATE_RESTAURANT(planId, restaurantId)
      );
      return response;
    } catch (error) {
      console.error(`Erro ao desassociar restaurante ${restaurantId} do plano ${planId}:`, error);
      throw error;
    }
  },
};

export default restaurantService;

