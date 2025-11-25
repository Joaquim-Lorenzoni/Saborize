/**
 * Contexto de Autenticação
 * 
 * Gerencia estado global do usuário autenticado
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

// Criar contexto
const AuthContext = createContext({});

/**
 * Provider do contexto de autenticação
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se usuário está autenticado ao carregar o app
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Verificar autenticação ao iniciar o app
   */
  const checkAuth = async () => {
    try {
      setLoading(true);
      
      const isAuth = await authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login do usuário
   */
  const login = async (email, password) => {
    try {
      console.log('🔐 Tentando fazer login...');
      const response = await authService.login(email, password);
      
      console.log('✅ Login bem-sucedido:', response.user?.email);
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      console.error('   Erro completo:', JSON.stringify(error, null, 2));
      
      // Melhorar mensagem de erro
      if (!error.status && !error.response) {
        throw {
          ...error,
          message: error.message || 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.',
        };
      }
      
      throw error;
    }
  };

  /**
   * Registro de novo usuário
   */
  const register = async (userData) => {
    try {
      console.log('📝 Tentando registrar usuário...');
      const response = await authService.register(userData);
      
      console.log('✅ Registro bem-sucedido:', response.user?.email);
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      console.error('   Erro completo:', JSON.stringify(error, null, 2));
      
      // Melhorar mensagem de erro
      if (!error.status && !error.response) {
        throw {
          ...error,
          message: error.message || 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.',
        };
      }
      
      throw error;
    }
  };

  /**
   * Logout do usuário
   */
  const logout = async () => {
    try {
      await authService.logout();
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  /**
   * Atualizar dados do usuário
   */
  const updateUser = async (userData) => {
    try {
      await authService.updateCurrentUser(userData);
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  /**
   * Verificar se usuário é admin
   */
  const isAdmin = () => {
    if (!user) return false;
    const userType = user.type;
    return userType === 'Admin' || userType === 'ADMIN' || userType === 0;
  };

  // Valor do contexto
  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: isAdmin(),
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

export default AuthContext;

