/**
 * Serviço de Conversão de Moeda
 * 
 * Integra com currency-service que usa API do Banco Central
 */

import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

const currencyService = {
  /**
   * Converter valor entre moedas
   * 
   * @param {number} value - Valor a ser convertido
   * @param {string} source - Moeda de origem (ex: 'BRL', 'USD', 'EUR')
   * @param {string} target - Moeda de destino (ex: 'USD', 'EUR', 'BRL')
   * @returns {Promise<Object>} Valor convertido e taxa de câmbio
   */
  convert: async (value, source, target) => {
    try {
      const endpoint = API_ENDPOINTS.CURRENCY_CONVERT(value, source.toUpperCase(), target.toUpperCase());
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Erro ao converter ${value} ${source} para ${target}:`, error);
      throw error;
    }
  },

  /**
   * Obter taxas de câmbio disponíveis
   * 
   * @returns {Promise<Object>} Taxas de câmbio
   */
  getRates: async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.CURRENCY_RATES);
      return response;
    } catch (error) {
      console.error('Erro ao buscar taxas de câmbio:', error);
      throw error;
    }
  },

  /**
   * Converter preço de produto para outra moeda
   * 
   * @param {number} price - Preço na moeda de origem
   * @param {string} sourceCurrency - Moeda de origem (padrão: 'BRL')
   * @param {string} targetCurrency - Moeda destino (ex: 'USD', 'EUR')
   * @returns {Promise<number>} Preço convertido
   */
  convertProductPrice: async (price, sourceCurrency = 'BRL', targetCurrency = 'USD') => {
    try {
      if (sourceCurrency === targetCurrency) {
        return price; // Mesma moeda
      }
      
      const result = await currencyService.convert(price, sourceCurrency, targetCurrency);
      
      // Retornar valor convertido (formato da resposta: { convertedValue: number })
      return result.convertedValue || result.value || price;
    } catch (error) {
      console.error(`Erro ao converter preço de ${sourceCurrency} para ${targetCurrency}:`, error);
      // Em caso de erro, retornar preço original
      return price;
    }
  },

  /**
   * Formatar valor monetário
   * 
   * @param {number} amount - Valor numérico
   * @param {string} currency - Código da moeda (ex: 'BRL', 'USD')
   * @returns {string} Valor formatado (ex: 'R$ 100,00' ou 'US$ 100.00')
   */
  formatCurrency: (amount, currency = 'BRL') => {
    const formatters = {
      BRL: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      USD: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      EUR: new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }),
    };

    const formatter = formatters[currency] || formatters.BRL;
    return formatter.format(amount);
  },
};

export default currencyService;

