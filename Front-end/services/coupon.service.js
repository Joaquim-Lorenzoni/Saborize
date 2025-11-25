/**
 * Serviço de Assinaturas
 * 
 * Gerencia assinaturas do usuário (pedidos realizados)
 */

import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

const couponService = {

  // ===== Assinaturas (Pedidos do usuário) =====

  /**
   * Listar assinaturas do usuário (pedidos já realizados)
   * 
   * @param {string} currency - Moeda para conversão (padrão: 'BRL')
   * @param {Object} params - Parâmetros de paginação
   * @returns {Promise<Page<OrderEntity>>} Página de pedidos/assinaturas
   */
  getUserSubscriptions: async (currency = 'BRL', params = {}) => {
    try {
      const endpoint = API_ENDPOINTS.USER_SUBSCRIPTIONS(currency);
      const pageParams = {
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort || 'orderDate,ASC',
        ...params,
      };
      const response = await apiService.get(endpoint, { params: pageParams });
      return response;
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error);
      throw error;
    }
  },
};

export default couponService;

