/**
 * Contexto de Moeda
 * 
 * Gerencia a moeda preferida do usuário e notifica mudanças
 */

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from '../services/user.service';
import { useAuth } from './AuthContext';

// Criar contexto
const CurrencyContext = createContext({});

// Chave para AsyncStorage
const CURRENCY_STORAGE_KEY = '@saborize_preferred_currency';

/**
 * Provider do contexto de moeda
 */
export function CurrencyProvider({ children }) {
  const [preferredCurrency, setPreferredCurrency] = useState('BRL');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  /**
   * Carregar moeda preferida do usuário
   */
  const loadPreferredCurrency = useCallback(async () => {
    const validCurrencies = ['BRL', 'USD', 'EUR'];
    
    try {
      // Primeiro, tentar carregar do AsyncStorage (persistência local)
      const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (savedCurrency && validCurrencies.includes(savedCurrency)) {
        setPreferredCurrency(savedCurrency);
        setLoading(false);
        
        // Se estiver autenticado, tentar sincronizar com backend (sem resetar se falhar)
        if (isAuthenticated) {
          try {
            const backendCurrency = await userService.getPreferredCurrency();
            if (backendCurrency && validCurrencies.includes(backendCurrency.toUpperCase())) {
              const validCurrency = backendCurrency.toUpperCase();
              if (validCurrency !== savedCurrency) {
                // Backend tem moeda diferente, atualizar
                setPreferredCurrency(validCurrency);
                await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, validCurrency);
              }
            }
          } catch (error) {
            // Se falhar ao buscar do backend, manter a moeda salva localmente
            console.warn('⚠️ Não foi possível sincronizar moeda do backend, mantendo moeda local:', error.message);
          }
        }
        return;
      }
      
      // Se não tem moeda salva localmente e está autenticado, buscar do backend
      if (isAuthenticated) {
        try {
          const currency = await userService.getPreferredCurrency();
          // Validar moeda retornada
          const validCurrency = validCurrencies.includes(currency?.toUpperCase()) 
            ? currency.toUpperCase() 
            : 'BRL';
          setPreferredCurrency(validCurrency);
          // Salvar no AsyncStorage para persistência
          await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, validCurrency);
        } catch (error) {
          // Se falhar, usar BRL como padrão apenas se não tiver nenhuma moeda salva
          console.warn('⚠️ Não foi possível buscar moeda preferida do backend:', error.message);
          setPreferredCurrency('BRL');
          await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, 'BRL');
        }
      } else {
        // Não autenticado e sem moeda salva, usar BRL
        setPreferredCurrency('BRL');
        await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, 'BRL');
      }
    } catch (error) {
      console.error('Erro ao carregar moeda:', error);
      setPreferredCurrency('BRL');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Atualizar moeda preferida
   */
  const updatePreferredCurrency = async (newCurrency) => {
    try {
      // Validar moeda antes de atualizar
      const validCurrencies = ['BRL', 'USD', 'EUR'];
      if (!validCurrencies.includes(newCurrency)) {
        console.warn('⚠️ Moeda inválida, usando BRL:', newCurrency);
        newCurrency = 'BRL';
      }
      
      // Atualizar estado local imediatamente
      setPreferredCurrency(newCurrency);
      
      // Salvar no AsyncStorage para persistência local
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
      
      // Salvar no backend se estiver autenticado (sem bloquear se falhar)
      if (isAuthenticated) {
        try {
          await userService.updatePreferences({
            preferredCurrency: newCurrency,
          });
        } catch (error) {
          // Se falhar ao salvar no backend, manter a atualização local
          console.warn('⚠️ Não foi possível salvar moeda no backend, mas mantendo localmente:', error.message);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar moeda preferida:', error);
      // Em caso de erro, tentar manter a moeda atual ou BRL
      try {
        const saved = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
        setPreferredCurrency(saved || 'BRL');
      } catch {
        setPreferredCurrency('BRL');
      }
      throw error;
    }
  };

  /**
   * Carregar moeda ao montar e quando autenticação mudar
   */
  useEffect(() => {
    loadPreferredCurrency();
  }, [loadPreferredCurrency]);

  // Valor do contexto
  const value = {
    preferredCurrency,
    updatePreferredCurrency,
    loading,
    reloadCurrency: loadPreferredCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

/**
 * Hook para usar o contexto de moeda
 */
export function useCurrency() {
  const context = useContext(CurrencyContext);
  
  if (!context) {
    throw new Error('useCurrency deve ser usado dentro de um CurrencyProvider');
  }
  
  return context;
}

export default CurrencyContext;

