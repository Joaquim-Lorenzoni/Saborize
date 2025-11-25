/**
 * Serviço de Pedidos
 * 
 * Gerencia operações de pedidos (checkout)
 */

import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

const orderService = {
  /**
   * Criar pedido (checkout)
   * 
   * @param {Array<Object>} items - Array de itens do pedido [{ productId, quantity }]
   * @returns {Promise<Object>} Dados do pedido criado
   */
  createOrder: async (items) => {
    try {
      // Formato esperado pelo backend: OrderDTO { items: OrderItemDTO[] }
      const orderDTO = {
        items: items.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity || 1,
        })),
      };
      
      const response = await apiService.post(API_ENDPOINTS.CREATE_ORDER, orderDTO);
      return response;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  /**
   * Listar pedidos do usuário
   * 
   * @param {string} currency - Moeda para conversão (padrão: 'BRL')
   * @param {Object} params - Parâmetros de paginação (page, size, sort)
   * @returns {Promise<Page<OrderEntity>>} Página de pedidos
   */
  getUserOrders: async (currency = 'BRL', params = {}) => {
    try {
      const endpoint = API_ENDPOINTS.WS_ORDERS_BY_CURRENCY(currency);
      const pageParams = {
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort || 'orderDate,ASC',
        ...params,
      };
      const response = await apiService.get(endpoint, { params: pageParams });
      return response;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  },
};

export default orderService;

