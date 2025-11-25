/**
 * Configuração da API
 * 
 * Backend: Microsserviços Spring Boot com Gateway (porta 8765)
 * 
 * IMPORTANTE:
 * - Android Emulator: use 'http://10.0.2.2:8765'
 * - iOS Simulator: use 'http://localhost:8765'
 * - Device Físico: use 'http://SEU_IP:8765' (ex: http://192.168.1.100:8765)
 */

import { Platform } from 'react-native';

// Detectar ambiente automaticamente
const getBaseURL = () => {
  if (__DEV__) {
    // Em desenvolvimento
    if (Platform.OS === 'android') {
      // Android Emulator precisa usar 10.0.2.2 em vez de localhost
      return 'http://10.0.2.2:8765';
    } else {
      // iOS Simulator pode usar localhost
      return 'http://localhost:8765';
    }
  } else {
    // Em produção, ajuste para sua URL real
    return 'https://api.seudominio.com';
  }
};

// URL base do Gateway (detecta automaticamente o ambiente)
export const API_BASE_URL = getBaseURL();

// Log da URL sendo usada (apenas em desenvolvimento)
if (__DEV__) {
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('🌐 Platform:', Platform.OS);
}

// ⚠️ SE ESTIVER USANDO DEVICE FÍSICO, DESCOMENTE E AJUSTE:
// export const API_BASE_URL = 'http://192.168.1.100:8765';  // Use o IP da sua máquina

// Endpoints da API (via Gateway)
export const API_ENDPOINTS = {
  // Autenticação (auth-service)
  LOGIN: '/auth/signin',
  REGISTER: '/auth/signup',
  LOGOUT: '/auth/logout',
  
  // Usuário (auth-service) - Endpoints autenticados
  USER_ME: '/ws/users/me',
  USER_PREFERENCES: '/ws/users/me/preferences',
  
  // Produtos (product-service) - Endpoints públicos
  PRODUCTS_BY_CURRENCY: (currency = 'BRL') => `/products/${currency}`,
  PRODUCT_BY_ID: (id, currency = 'BRL') => `/products/${id}/${currency}`,
  PRODUCT_BY_ID_NO_CONVERTER: (id) => `/products/noconverter/${id}`,
  
  // Produtos (product-service) - Endpoints autenticados (admin)
  WS_PRODUCTS: '/ws/products',
  WS_PRODUCT_BY_ID: (id) => `/ws/products/${id}`,
  WS_ASSOCIATE_RESTAURANT: (planId, restaurantId) => `/ws/products/${planId}/restaurants/${restaurantId}`,
  WS_DISASSOCIATE_RESTAURANT: (planId, restaurantId) => `/ws/products/${planId}/restaurants/${restaurantId}`,
  
  // Restaurantes (product-service) - Endpoints autenticados (admin)
  WS_RESTAURANTS: '/ws/restaurants',
  WS_RESTAURANT_BY_ID: (id) => `/ws/restaurants/${id}`,
  
  // Pedidos (order-service) - Endpoints autenticados
  WS_ORDERS: '/ws/orders',
  WS_ORDERS_BY_CURRENCY: (currency = 'BRL') => `/ws/orders/${currency}`,
  CREATE_ORDER: '/ws/orders',  // POST para criar pedido (checkout)
  
  // Assinaturas (order-service) - Pedidos do usuário
  USER_SUBSCRIPTIONS: (currency = 'BRL') => `/ws/orders/${currency}`,
  
  // Conversão de Moeda (currency-service)
  CURRENCY_CONVERT: (value, source, target) => `/currency/${value}/${source}/${target}`,
  
  // Admin - Endpoints já configurados acima (WS_PRODUCTS, WS_RESTAURANTS)
};

// Timeout padrão para requisições (em ms)
export const API_TIMEOUT = 15000;

// Chave para armazenar token no AsyncStorage
export const TOKEN_KEY = '@saborize_token';

// Chave para armazenar dados do usuário no AsyncStorage
export const USER_KEY = '@saborize_user';

