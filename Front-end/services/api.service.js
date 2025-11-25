/**
 * Serviço base da API
 * 
 * Configuração do Axios com interceptors para:
 * - Adicionar token JWT automaticamente
 * - Tratar erros globalmente
 * - Log de requisições (dev)
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT, TOKEN_KEY } from '../config/api';

// Criar instância do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUEST - adiciona token JWT
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Buscar token do AsyncStorage
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (token) {
        // Adicionar token no header Authorization
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log para debug (apenas em desenvolvimento)
      if (__DEV__) {
        console.log('🔵 API Request:', config.method.toUpperCase(), config.baseURL + config.url);
        console.log('🔵 Full URL:', config.baseURL + config.url);
        console.log('🔵 Request Data:', config.data);
      }
      
      return config;
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      return config;
    }
  },
  (error) => {
    console.error('Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - trata erros globalmente
apiClient.interceptors.response.use(
  (response) => {
    // Log para debug (apenas em desenvolvimento)
    if (__DEV__) {
      console.log('🟢 API Response:', response.config.url, response.status);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log de erro detalhado
    if (__DEV__) {
      console.error('🔴 API Error Details:');
      console.error('  URL:', error.config?.baseURL + error.config?.url);
      console.error('  Method:', error.config?.method);
      console.error('  Status:', error.response?.status);
      console.error('  Response:', error.response?.data);
      console.error('  Request Error:', error.request);
      console.error('  Message:', error.message);
    }
    
    // Se erro 401 (não autorizado), fazer logout
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Remover token inválido
      await AsyncStorage.removeItem(TOKEN_KEY);
      
      // Aqui você pode redirecionar para tela de login
      // ou disparar um evento para o AuthContext
    }
    
    // Tratar erros comuns
    const errorMessage = getErrorMessage(error);
    
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

/**
 * Extrair mensagem de erro amigável
 */
function getErrorMessage(error) {
  if (error.response) {
    // Erro vindo do backend
    const { data } = error.response;
    
    // Se o backend retornar um formato específico
    if (data?.error?.message) {
      return data.error.message;
    }
    
    if (data?.message) {
      return data.message;
    }
    
    // Mensagens padrão por status
    switch (error.response.status) {
      case 400:
        return 'Dados inválidos. Verifique as informações enviadas.';
      case 401:
        return 'Não autorizado. Faça login novamente.';
      case 403:
        return 'Acesso negado.';
      case 404:
        return 'Recurso não encontrado.';
      case 500:
        return 'Erro no servidor. Tente novamente mais tarde.';
      default:
        return 'Erro ao processar requisição.';
    }
  } else if (error.request) {
    // Requisição foi feita mas não houve resposta
    const fullUrl = error.config?.baseURL + error.config?.url;
    console.error('❌ No response from server');
    console.error('   Request URL:', fullUrl);
    console.error('   Base URL:', error.config?.baseURL);
    console.error('   Endpoint:', error.config?.url);
    console.error('   Method:', error.config?.method?.toUpperCase());
    console.error('   Check if backend is running on:', error.config?.baseURL);
    console.error('   💡 Test with: curl', fullUrl);
    return 'Sem resposta do servidor. Verifique se o backend está rodando e a URL está correta.';
  } else {
    // Erro na configuração da requisição
    console.error('❌ Request configuration error:', error.message);
    return 'Erro ao configurar requisição: ' + error.message;
  }
}

/**
 * Métodos auxiliares do serviço
 */
const apiService = {
  /**
   * GET request
   */
  get: async (url, config = {}) => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  /**
   * POST request
   */
  post: async (url, data = {}, config = {}) => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  put: async (url, data = {}, config = {}) => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   */
  patch: async (url, data = {}, config = {}) => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  delete: async (url, config = {}) => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },
};

export default apiService;

