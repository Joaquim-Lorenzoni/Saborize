import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAuth } from '../contexts/AuthContext';
import planService from '../services/plan.service';
import userService from '../services/user.service';

export default function AdminScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState('BRL');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  /**
   * Verificar se usuário é admin
   */
  useEffect(() => {
    // Não mostrar alerta se estiver fazendo logout
    if (!isAdmin && !isLoggingOut) {
      Alert.alert(
        'Acesso Negado',
        'Você não tem permissão para acessar esta tela.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [isAdmin, isLoggingOut]);

  /**
   * Carregar dados iniciais
   */
  useEffect(() => {
    if (isAdmin) {
      loadInitialData();
    }
  }, [isAdmin]);

  /**
   * Recarregar produtos quando a tela receber foco (após editar/criar)
   */
  useFocusEffect(
    useCallback(() => {
      if (isAdmin && currency) {
        console.log('🔄 Recarregando produtos na tela admin...');
        loadProducts(currency);
      }
    }, [isAdmin, currency])
  );

  /**
   * Carregar dados iniciais
   */
  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      
      // Buscar moeda preferida (com fallback silencioso)
      let preferredCurrency = 'BRL';
      try {
        preferredCurrency = await userService.getPreferredCurrency();
      } catch (error) {
        // Se falhar, usar BRL como padrão sem mostrar erro
        console.warn('Usando moeda padrão BRL');
      }
      setCurrency(preferredCurrency);
      
      // Carregar produtos
      await loadProducts(preferredCurrency);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Carregar produtos da API
   */
  const loadProducts = async (targetCurrency = 'BRL') => {
    try {
      const response = await planService.getAllPlans(targetCurrency, {
        page: 0,
        size: 100,
        sort: 'description,ASC',
      });
      
      const productsList = response.content || response || [];
      
      // Filtrar produtos se houver busca
      if (searchQuery.trim()) {
        const filtered = productsList.filter(product => {
          const query = searchQuery.toLowerCase().trim();
          const name = (product.name || '').toLowerCase();
          const description = (product.description || '').toLowerCase();
          return name.includes(query) || description.includes(query);
        });
        setProducts(filtered);
      } else {
        setProducts(productsList);
      }
      
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProducts([]);
    }
  };

  /**
   * Recarregar produtos quando busca ou moeda mudar
   */
  useEffect(() => {
    if (isAdmin && currency) {
      loadProducts(currency);
    }
  }, [searchQuery, currency, isAdmin]);

  /**
   * Deletar produto
   */
  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await planService.deleteProduct(productId);
              Alert.alert('Sucesso', 'Produto excluído com sucesso!');
              await loadProducts(currency);
            } catch (error) {
              console.error('Erro ao excluir produto:', error);
              Alert.alert('Erro', error.message || 'Não foi possível excluir o produto.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleNavigation = (path, params = {}) => {
    setLoading(true);
    setTimeout(() => {
      router.push({ pathname: path, params });
      setLoading(false);
    }, 200);
  };

  /**
   * Fazer logout
   */
  const handleLogout = async () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              setIsLoggingOut(true); // Marcar que estamos fazendo logout
              
              // Redirecionar primeiro para evitar o alerta
              router.replace('/');
              
              // Limpar estado após redirecionamento
              await logout();
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              setIsLoggingOut(false); // Resetar em caso de erro
              Alert.alert('Erro', 'Não foi possível fazer logout.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };


  // Se não for admin, não renderizar nada
  if (!isAdmin) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerPlaceholder} />
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color="#792F14" />
          </TouchableOpacity>
        </View>

        {/* Indicador de Localização */}
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={20} color="#792F14" />
          <Text style={styles.locationText}>Passo Fundo, RS</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#792F14" />
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Busque um plano aqui"
            placeholderTextColor="#B8A99A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <MaterialIcons name="close" size={20} color="#792F14" />
            </TouchableOpacity>
          ) : null}
          <MaterialIcons name="search" size={24} color="#792F14" style={styles.searchIcon} />
        </View>

        {/* Botão Adicionar Novo Plano */}
        <TouchableOpacity 
          style={styles.addPlanButton}
          onPress={() => handleNavigation('/add-plan')}
        >
          <MaterialIcons name="add" size={24} color="#792F14" />
          <Text style={styles.addPlanButtonText}>Adicionar um novo plano</Text>
        </TouchableOpacity>

        {/* Grid de Produtos */}
        {products.length > 0 ? (
          <View style={styles.categoriesGrid}>
            {products.map((product) => (
              <View key={product.id} style={styles.productCardWrapper}>
                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => handleNavigation('/plan-details', { 
                    planId: product.id,
                    isAdmin: 'true'
                  })}
                >
                  <View style={styles.productImageContainer}>
                    {product.imageUrl ? (
                      <Image
                        source={{ uri: product.imageUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.categoryEmoji}>📦</Text>
                    )}
                  </View>
                  <Text style={styles.categoryName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    {currency === 'BRL' ? 'R$' : '$'} {product.convertedPrice?.toFixed(2) || product.price?.toFixed(2) || '0.00'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProduct(product.id)}
                >
                  <MaterialIcons name="delete" size={20} color="#E07A5F" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              {searchQuery.trim() ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado.'}
            </Text>
          </View>
        )}

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Barra de Navegação Inferior - Removida para admin */}

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEDC3',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerPlaceholder: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#FFF7DD',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FAEDC3',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFF7DD',
    paddingVertical: 12,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    marginLeft: 6,
    marginRight: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7DD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#792F14',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  addPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#792F14',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFF7DD',
  },
  addPlanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    marginLeft: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  productCardWrapper: {
    width: '47%',
    marginBottom: 15,
    position: 'relative',
  },
  categoryCard: {
    width: '100%',
    backgroundColor: '#FFF7DD',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FAEDC3',
  },
  productImageContainer: {
    width: 70,
    height: 70,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  categoryEmoji: {
    fontSize: 50,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#792F14',
    textAlign: 'center',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E07A5F',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFF7DD',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FAEDC3',
  },
  emptyStateContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#792F14',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 130,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#EADDCB',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  activeNavItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF7DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EADDCB',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

