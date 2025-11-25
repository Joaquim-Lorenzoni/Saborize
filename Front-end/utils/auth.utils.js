/**
 * Utilitários de Autenticação
 * 
 * Funções auxiliares para verificar permissões e tipo de usuário
 */

/**
 * Verificar se o usuário é admin
 * 
 * @param {Object} user - Objeto do usuário
 * @returns {boolean} True se for admin
 */
export const isAdmin = (user) => {
  if (!user) return false;
  
  // Backend retorna type como enum (Admin = 0, Common = 1)
  // Pode vir como string "Admin" ou número 0
  const userType = user.type;
  
  if (userType === 'Admin' || userType === 'ADMIN' || userType === 0) {
    return true;
  }
  
  return false;
};

/**
 * Verificar se o usuário é comum
 * 
 * @param {Object} user - Objeto do usuário
 * @returns {boolean} True se for usuário comum
 */
export const isCommonUser = (user) => {
  if (!user) return false;
  
  const userType = user.type;
  
  if (userType === 'Common' || userType === 'COMMON' || userType === 1) {
    return true;
  }
  
  return false;
};

/**
 * Obter tipo de usuário como string
 * 
 * @param {Object} user - Objeto do usuário
 * @returns {string} 'admin' ou 'common'
 */
export const getUserType = (user) => {
  if (isAdmin(user)) return 'admin';
  if (isCommonUser(user)) return 'common';
  return 'unknown';
};

