/**
 * Serviço de Carrinho (Gerenciamento Local)
 * 
 * Nota: O backend não possui endpoints de carrinho separados.
 * O carrinho é gerenciado localmente no frontend até o checkout.
 * Use orderService.createOrder() para finalizar a compra.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = '@saborize_cart';

const cartService = {
  /**
   * Obter carrinho do AsyncStorage
   * 
   * @returns {Promise<Array>} Itens do carrinho
   */
  getCart: async () => {
    try {
      const cartJson = await AsyncStorage.getItem(CART_KEY);
      return cartJson ? JSON.parse(cartJson) : [];
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      return [];
    }
  },

  /**
   * Salvar carrinho no AsyncStorage
   * 
   * @param {Array} items - Itens do carrinho
   */
  saveCart: async (items) => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
      throw error;
    }
  },

  /**
   * Adicionar item ao carrinho
   * 
   * @param {Object} item - Item a ser adicionado { id, name, price, quantity, ... }
   * @returns {Promise<Array>} Carrinho atualizado
   */
  addItem: async (item) => {
    try {
      const cart = await cartService.getCart();
      const existingItemIndex = cart.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item já existe, atualizar quantidade
        cart[existingItemIndex].quantity += (item.quantity || 1);
      } else {
        // Novo item
        cart.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }
      
      await cartService.saveCart(cart);
      return cart;
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      throw error;
    }
  },

  /**
   * Remover item do carrinho
   * 
   * @param {number} itemId - ID do item a ser removido
   * @returns {Promise<Array>} Carrinho atualizado
   */
  removeItem: async (itemId) => {
    try {
      const cart = await cartService.getCart();
      const filteredCart = cart.filter(item => item.id !== itemId);
      await cartService.saveCart(filteredCart);
      return filteredCart;
    } catch (error) {
      console.error(`Erro ao remover item ${itemId} do carrinho:`, error);
      throw error;
    }
  },

  /**
   * Atualizar quantidade de um item
   * 
   * @param {number} itemId - ID do item
   * @param {number} quantity - Nova quantidade
   * @returns {Promise<Array>} Carrinho atualizado
   */
  updateItemQuantity: async (itemId, quantity) => {
    try {
      const cart = await cartService.getCart();
      const itemIndex = cart.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remover se quantidade for 0 ou negativa
          cart.splice(itemIndex, 1);
        } else {
          cart[itemIndex].quantity = quantity;
        }
        await cartService.saveCart(cart);
      }
      
      return cart;
    } catch (error) {
      console.error(`Erro ao atualizar item ${itemId}:`, error);
      throw error;
    }
  },

  /**
   * Limpar carrinho
   * 
   * @returns {Promise<void>}
   */
  clearCart: async () => {
    try {
      await AsyncStorage.removeItem(CART_KEY);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    }
  },

  /**
   * Calcular total do carrinho
   * 
   * @param {Array} cart - Itens do carrinho (opcional, busca automaticamente se não fornecido)
   * @returns {Promise<number>} Total do carrinho
   */
  calculateTotal: async (cart = null) => {
    try {
      const items = cart || await cartService.getCart();
      return items.reduce((total, item) => {
        const price = item.convertedPrice || item.price || 0;
        return total + (price * (item.quantity || 1));
      }, 0);
    } catch (error) {
      console.error('Erro ao calcular total:', error);
      return 0;
    }
  },
};

export default cartService;

