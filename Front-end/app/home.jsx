import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import planService from '../services/plan.service';
import userService from '../services/user.service';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [products, setProducts] = useState([]);
  const [userName, setUserName] = useState('Usuário');
  const { user, isAuthenticated } = useAuth();
  const { preferredCurrency } = useCurrency();

  const handleNavigation = (path, params = {}) => {
    setLoading(true);
    setTimeout(() => {
      router.push({ pathname: path, params });
      setLoading(false);
    }, 200);
  };

  /**
   * Carregar dados iniciais
   */
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Recarregar produtos quando moeda preferida mudar
   */
  useEffect(() => {
    // Garantir que temos uma moeda válida antes de carregar
    const validCurrencies = ['BRL', 'USD', 'EUR'];
    if (preferredCurrency && validCurrencies.includes(preferredCurrency)) {
      loadProducts();
    } else if (!preferredCurrency) {
      // Se não tiver moeda, usar BRL
      loadProducts();
    }
  }, [preferredCurrency]);


  /**
   * Carregar dados iniciais (usuário e produtos)
   */
  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      
      // Buscar dados do usuário apenas se estiver autenticado
      if (user) {
        setUserName(user.name || 'Usuário');
      } else if (isAuthenticated) {
        // Tentar buscar do serviço se não estiver no contexto mas estiver autenticado
        try {
          const userData = await userService.getCurrentUser();
          setUserName(userData.name || 'Usuário');
        } catch (error) {
          // Não mostrar erro se for 401 (não autenticado)
          if (error.status !== 401) {
            console.warn('Erro ao buscar dados do usuário:', error);
          }
        }
      }
      
      // Não recarregar moeda aqui - usar a moeda atual do contexto
      // Isso evita resetar para BRL quando não está autenticado
      
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Carregar produtos da API
   */
  const loadProducts = async () => {
    // Garantir que sempre temos uma moeda válida
    const currency = preferredCurrency || 'BRL';
    
    // Validar moeda antes de enviar
    const validCurrencies = ['BRL', 'USD', 'EUR'];
    const targetCurrency = validCurrencies.includes(currency) ? currency : 'BRL';
    
    try {
      setLoadingData(true);
      
      const response = await planService.getAllPlans(targetCurrency, {
        page: 0,
        size: 4, // Limitar a 4 produtos na home
        sort: 'description,ASC',
      });
      
      // Se for paginação, pegar o conteúdo
      const productsList = response.content || response || [];
      setProducts(productsList);
      
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar os produtos. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Navegar para detalhes do produto
   */
  const handleProductPress = (productId) => {
    handleNavigation('/plan-details', { planId: productId });
  };

  return (
    <View style={styles.container}>
      {/* Topo Amarelo com Header  */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {userName}</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => handleNavigation('/profile')}
          >
            <Text style={styles.avatar}>🦝</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Container Branco com Bordas Arredondadas */}
      <ScrollView 
        style={styles.whiteContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* Banner Promocional */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../assets/images/BANNER P.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Seção de Planos (Produtos Reais da API) */}
        {products.length > 0 ? (
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Planos especiais para você</Text>
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={() => handleNavigation('/search')}
              >
                <Text style={styles.seeMoreLink}>Ver Mais</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categoriesGrid}>
              {products.slice(0, 4).map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.categoryCard}
                  onPress={() => handleProductPress(product.id)}
                >
                  <View style={styles.categoryImageContainer}>
                    {product.imageUrl ? (
                      <Image
                        source={{ uri: product.imageUrl }}
                        style={styles.categoryImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.categoryImagePlaceholder}>📦</Text>
                    )}
                  </View>
                  <View style={styles.categoryNameContainer}>
                    <Text style={styles.categoryName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={styles.categoryPrice}>
                      {preferredCurrency === 'BRL' ? 'R$' : preferredCurrency === 'USD' ? '$' : '€'} {product.convertedPrice?.toFixed(2) || product.price?.toFixed(2) || '0.00'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Planos especiais para você</Text>
            </View>
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>Nenhum plano disponível no momento.</Text>
            </View>
          </View>
        )}

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Barra de Navegação Inferior */}
      <BottomNavBar activeRoute="home" />

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading || loadingData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEDC3',
  },
  topSection: {
    backgroundColor: '#FAEDC3',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#792F14',
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    fontSize: 35,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  bannerImage: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    textAlign: 'center',
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  seeMoreButton: {
    position: 'absolute',
    right: 0,
  },
  seeMoreLink: {
    fontSize: 14,
    color: '#D5924D',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#FFF7DD',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryImageContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  categoryImage: {
    width: 70,
    height: 70,
  },
  categoryNameContainer: {
    backgroundColor: '#FAEDC3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0E0C0',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#792F14',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E07A5F',
    textAlign: 'center',
  },
  categoryImagePlaceholder: {
    fontSize: 40,
  },
  emptyStateContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8B6F47',
    textAlign: 'center',
  },
  productsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '47%',
    backgroundColor: '#FFF7DD',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  productImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#FAEDC3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImagePlaceholderText: {
    fontSize: 40,
  },
  productInfoContainer: {
    backgroundColor: '#FAEDC3',
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0E0C0',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#792F14',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#792F14',
  },
  bottomSpacer: {
    height: 130,
  },
});

