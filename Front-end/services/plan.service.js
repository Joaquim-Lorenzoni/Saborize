/**
 * Serviço de Planos
 * 
 * Gerencia operações relacionadas a planos de assinatura
 */

import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

const planService = {
  /**
   * Listar todos os produtos/planos (com paginação)
   * 
   * @param {string} currency - Moeda (padrão: 'BRL')
   * @param {Object} params - Parâmetros de paginação (page, size, sort)
   * @returns {Promise<Page<ProductEntity>>} Página de produtos com conversão de moeda
   */
  getAllPlans: async (currency = 'BRL', params = {}) => {
    try {
      // Garantir que sempre temos uma moeda válida
      const validCurrencies = ['BRL', 'USD', 'EUR'];
      const targetCurrency = validCurrencies.includes(currency?.toUpperCase()) 
        ? currency.toUpperCase() 
        : 'BRL';
      
      const endpoint = API_ENDPOINTS.PRODUCTS_BY_CURRENCY(targetCurrency);
      // Parâmetros padrão de paginação
      const pageParams = {
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort || 'description,ASC',
        ...params,
      };
      const response = await apiService.get(endpoint, { params: pageParams });
      return response;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  /**
   * Buscar produto por ID
   * 
   * @param {number} id - ID do produto
   * @param {string} currency - Moeda (padrão: 'BRL')
   * @returns {Promise<Object>} Dados do produto
   */
  getPlanById: async (id, currency = 'BRL') => {
    try {
      // Garantir que sempre temos uma moeda válida
      const validCurrencies = ['BRL', 'USD', 'EUR'];
      const targetCurrency = validCurrencies.includes(currency?.toUpperCase()) 
        ? currency.toUpperCase() 
        : 'BRL';
      
      const response = await apiService.get(API_ENDPOINTS.PRODUCT_BY_ID(id, targetCurrency));
      return response;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar produtos por categoria
   * Nota: Backend retorna todos os produtos, filtro deve ser feito no frontend
   * 
   * @param {string} category - Categoria do produto
   * @param {string} currency - Moeda (padrão: 'BRL')
   * @param {Object} params - Parâmetros de paginação
   * @returns {Promise<Page<ProductEntity>>} Página de produtos
   */
  getPlansByCategory: async (category, currency = 'BRL', params = {}) => {
    try {
      // Backend não tem filtro por categoria, buscar todos
      const endpoint = API_ENDPOINTS.PRODUCTS_BY_CURRENCY(currency);
      const pageParams = {
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort || 'description,ASC',
        ...params,
      };
      const response = await apiService.get(endpoint, { params: pageParams });
      // Filtrar por categoria no frontend se necessário
      return response;
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${category}:`, error);
      throw error;
    }
  },

  /**
   * Buscar produtos com filtros/pesquisa
   * Nota: Backend retorna todos os produtos, filtro deve ser feito no frontend
   * 
   * @param {string} searchTerm - Termo de busca
   * @param {string} currency - Moeda (padrão: 'BRL')
   * @param {Object} params - Parâmetros de paginação
   * @returns {Promise<Page<ProductEntity>>} Página de produtos
   */
  searchPlans: async (searchTerm = '', currency = 'BRL', params = {}) => {
    try {
      // Backend não tem endpoint de busca, buscar todos
      const endpoint = API_ENDPOINTS.PRODUCTS_BY_CURRENCY(currency);
      const pageParams = {
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort || 'description,ASC',
        ...params,
      };
      const response = await apiService.get(endpoint, { params: pageParams });
      // Filtrar por termo de busca no frontend se necessário
      return response;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  /**
   * Criar produto pelo usuário (requer admin - userType 0)
   * 
   * @param {Object} productData - Dados do produto (name, description, price, currency, imageUrl)
   * @returns {Promise<Object>} Produto criado
   */
  createProduct: async (productData) => {
    try {
      // Formato esperado pelo backend: ProductDTO
      const dto = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        currency: productData.currency || 'BRL',
        imageUrl: productData.imageUrl || '',
      };
      
      console.log('📦 Criando produto:', dto);
      const response = await apiService.post(API_ENDPOINTS.WS_PRODUCTS, dto);
      console.log('✅ Produto criado:', response);
      return response;
    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      throw error;
    }
  },

  /**
   * Atualizar produto (requer admin - userType 0)
   * 
   * @param {number} id - ID do produto
   * @param {Object} productData - Dados do produto atualizados
   * @returns {Promise<Object>} Produto atualizado
   */
  updateProduct: async (id, productData) => {
    try {
      // Formato esperado pelo backend: ProductDTO
      const dto = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        currency: productData.currency || 'BRL',
        imageUrl: productData.imageUrl || '',
      };
      
      console.log(`📦 Atualizando produto ${id}:`, dto);
      const response = await apiService.put(API_ENDPOINTS.WS_PRODUCT_BY_ID(id), dto);
      console.log('✅ Produto atualizado:', response);
      return response;
    } catch (error) {
      console.error(`❌ Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  // ===== Métodos ADMIN (Aliases para compatibilidade) =====

  /**
   * Criar novo plano (Admin) - Alias para createProduct
   */
  createPlan: async (planData) => {
    // Chamar createProduct diretamente (sem referência circular)
    const dto = {
      name: planData.name,
      description: planData.description,
      price: planData.price,
      currency: planData.currency || 'BRL',
      imageUrl: planData.imageUrl || '',
    };
    return apiService.post(API_ENDPOINTS.WS_PRODUCTS, dto);
  },

  /**
   * Atualizar plano (Admin) - Alias para updateProduct
   */
  updatePlan: async (id, planData) => {
    // Chamar updateProduct diretamente (sem referência circular)
    const dto = {
      name: planData.name,
      description: planData.description,
      price: planData.price,
      currency: planData.currency || 'BRL',
      imageUrl: planData.imageUrl || '',
    };
    return apiService.put(API_ENDPOINTS.WS_PRODUCT_BY_ID(id), dto);
  },

  /**
   * Deletar produto (Admin)
   * 
   * @param {number} id - ID do produto
   * @returns {Promise<void>}
   */
  deleteProduct: async (id) => {
    try {
      await apiService.delete(API_ENDPOINTS.WS_PRODUCT_BY_ID(id));
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletar plano (Admin) - Alias para deleteProduct
   */
  deletePlan: async (id) => {
    try {
      await apiService.delete(API_ENDPOINTS.WS_PRODUCT_BY_ID(id));
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  },
};

export default planService;

