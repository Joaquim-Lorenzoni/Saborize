import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';
import LoadingOverlay from '../components/LoadingOverlay';
import { useCurrency } from '../contexts/CurrencyContext';
import couponService from '../services/coupon.service';
import planService from '../services/plan.service';

export default function CouponsScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [productsCache, setProductsCache] = useState({}); // Cache de produtos para evitar múltiplas chamadas
  const { preferredCurrency } = useCurrency();

  /**
   * Carregar dados ao montar a tela e quando moeda mudar
   */
  useEffect(() => {
    if (preferredCurrency) {
      loadData();
    }
  }, [preferredCurrency]);

  /**
   * Carregar assinaturas
   */
  const loadData = async () => {
    try {
      setLoadingData(true);
      
      // Garantir que temos uma moeda válida
      const validCurrencies = ['BRL', 'USD', 'EUR'];
      const currency = validCurrencies.includes(preferredCurrency) ? preferredCurrency : 'BRL';
      
      // Carregar assinaturas (pedidos do usuário) com moeda atual
      await loadSubscriptions(currency);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Carregar assinaturas (pedidos do usuário)
   */
  const loadSubscriptions = async (targetCurrency) => {
    try {
      const response = await couponService.getUserSubscriptions(targetCurrency, {
        page: 0,
        size: 20,
        sort: 'orderDate,DESC',
      });
      
      const subscriptionsList = response.content || response || [];
      setSubscriptions(subscriptionsList);
      
      // Pré-carregar nomes dos produtos em paralelo
      const productIds = new Set();
      subscriptionsList.forEach(order => {
        order.items?.forEach(item => {
          const productId = item.productId || item.product?.id;
          if (productId) {
            productIds.add(productId);
          }
        });
      });
      
      // Buscar todos os produtos em paralelo e atualizar cache
      if (productIds.size > 0) {
        const productPromises = Array.from(productIds).map(async (productId) => {
          try {
            // Buscar produto completo da API para obter o name (ProductEntity tem name)
            const product = await planService.getPlanById(productId, targetCurrency);
            const name = product.name || product.description || 'Plano não encontrado';
            return { productId, name };
          } catch (error) {
            console.warn(`Erro ao buscar produto ${productId}:`, error);
            return { productId, name: 'Plano não encontrado' };
          }
        });
        
        const results = await Promise.all(productPromises);
        // Atualizar cache com todos os nomes de uma vez
        const newCache = { ...productsCache };
        results.forEach(({ productId, name }) => {
          newCache[productId] = name;
        });
        setProductsCache(newCache);
      }
      
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error);
      setSubscriptions([]);
    }
  };


  /**
   * Formatar data
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'N/A';
    }
  };

  /**
   * Obter nome do plano do pedido
   */
  const getPlanName = (order) => {
    if (!order.items || order.items.length === 0) return 'Plano não encontrado';
    
    const firstItem = order.items[0];
    const productId = firstItem?.productId || firstItem?.product?.id;
    
    // Se temos o produto no cache, usar o name
    if (productId && productsCache[productId]) {
      const productName = productsCache[productId];
      if (order.items.length === 1) {
        return productName;
      }
      return `${productName} +${order.items.length - 1}`;
    }
    
    // Fallback temporário: usar description enquanto carrega o name completo
    const fallbackName = firstItem?.product?.description 
      || firstItem?.product?.name
      || firstItem?.productName 
      || 'Carregando...';
    
    return fallbackName;
  };

  /**
   * Calcular total de um pedido (já vem convertido do backend)
   */
  const calculateOrderTotal = (order) => {
    // O backend já calcula totalConvertedPrice quando passamos a moeda correta
    if (order.totalConvertedPrice !== undefined && order.totalConvertedPrice !== null && order.totalConvertedPrice > 0) {
      return order.totalConvertedPrice;
    }
    
    // Fallback: calcular manualmente usando convertedPriceAtPruchase (note o typo no backend)
    if (!order.items || order.items.length === 0) return 0;
    
    const total = order.items.reduce((sum, item) => {
      // O backend preenche convertedPriceAtPruchase (com typo) quando converte
      // Também pode estar em convertedPriceAtPurchase (sem typo) ou no product.convertedPrice
      const price = item.convertedPriceAtPruchase 
        || item.convertedPriceAtPurchase 
        || item.product?.convertedPrice 
        || item.priceAtPurchase || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
    
    return total;
  };

  /**
   * Obter símbolo da moeda
   */
  const getCurrencySymbol = () => {
    return preferredCurrency === 'BRL' ? 'R$' : preferredCurrency === 'USD' ? '$' : '€';
  };

  const handleNavigation = (path, params = {}) => {
    setLoading(true);
    setTimeout(() => {
      if (path === 'back') {
        router.back();
      } else {
        router.push({ pathname: path, params });
      }
      setLoading(false);
    }, 200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleNavigation('back')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#792F14" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas assinaturas</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção Minhas Assinaturas (Pedidos) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Assinaturas</Text>
          
          {subscriptions.length > 0 ? (
            subscriptions.map((order) => {
              const total = calculateOrderTotal(order);
              const planName = getPlanName(order);
              
              // Debug: log para verificar estrutura dos dados
              if (__DEV__) {
                console.log('📦 Order:', order.id);
                console.log('  - Items:', order.items?.length);
                if (order.items?.[0]) {
                  console.log('  - First item:', JSON.stringify(order.items[0], null, 2));
                  console.log('  - First item product:', JSON.stringify(order.items[0]?.product, null, 2));
                }
                console.log('  - Total converted:', order.totalConvertedPrice);
                console.log('  - Calculated total:', total);
                console.log('  - Plan name:', planName);
              }
              
              return (
                <View key={order.id} style={styles.couponWrapper}>
                  <TouchableOpacity style={styles.couponCard}>
                    <View style={styles.orderInfo}>
                      <Text style={styles.couponName}>
                        {planName}
                      </Text>
                      <Text style={styles.orderItems}>
                        {order.items?.length || 0} item(ns)
                      </Text>
                      <Text style={styles.orderDate}>
                        {formatDate(order.orderDate)}
                      </Text>
                    </View>
                    <View style={styles.orderTotal}>
                      <Text style={styles.couponDiscount}>
                        {getCurrencySymbol()} {Math.abs(total).toFixed(2).replace('.', ',')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Nenhuma assinatura encontrada</Text>
          )}
        </View>

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Barra de Navegação Inferior */}
      <BottomNavBar activeRoute="coupons" />

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading || loadingData} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#792F14',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#792F14',
    marginBottom: 16,
  },
  couponWrapper: {
    backgroundColor: '#FAEDC3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  couponCard: {
    backgroundColor: '#FFF7DD',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#792F14',
  },
  couponDiscount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#792F14',
  },
  validityText: {
    fontSize: 11,
    color: '#8B6F47',
    textAlign: 'right',
    marginTop: 8,
  },
  bottomSpacer: {
    height: 130,
  },
  couponPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    marginRight: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderItems: {
    fontSize: 12,
    color: '#8B6F47',
    marginTop: 4,
  },
  orderDate: {
    fontSize: 11,
    color: '#8B6F47',
    marginTop: 4,
  },
  orderTotal: {
    alignItems: 'flex-end',
  },
  emptyText: {
    fontSize: 14,
    color: '#8B6F47',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

