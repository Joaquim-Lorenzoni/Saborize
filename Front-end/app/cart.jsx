import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../components/LoadingOverlay';
import { useCurrency } from '../contexts/CurrencyContext';
import cartService from '../services/cart.service';
import orderService from '../services/order.service';
import planService from '../services/plan.service';

export default function CartScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { preferredCurrency } = useCurrency();

  /**
   * Atualizar preços convertidos dos itens do carrinho
   */
  const updateCartPrices = useCallback(async () => {
    if (!preferredCurrency) return;
    
    // Garantir que temos uma moeda válida
    const validCurrencies = ['BRL', 'USD', 'EUR'];
    const targetCurrency = validCurrencies.includes(preferredCurrency) ? preferredCurrency : 'BRL';
    
    try {
      // Buscar itens atuais do carrinho (não usar state para evitar problemas de timing)
      const currentItems = await cartService.getCart();
      
      const updatedItems = await Promise.all(
        currentItems.map(async (item) => {
          // Se o item tem ID numérico, buscar da API para obter valor convertido
          const numericId = parseInt(item.id);
          if (!isNaN(numericId)) {
            try {
              const productData = await planService.getPlanById(numericId, targetCurrency);
              return {
                ...item,
                convertedPrice: productData.convertedPrice || productData.price,
                price: productData.price, // Manter preço original também
                currency: targetCurrency, // Salvar moeda atual
              };
            } catch (error) {
              console.warn(`Erro ao atualizar preço do produto ${numericId}:`, error);
              return {
                ...item,
                currency: targetCurrency, // Atualizar moeda mesmo se falhar
              };
            }
          }
          // Manter item mockado mas atualizar moeda
          return {
            ...item,
            currency: targetCurrency,
          };
        })
      );

      // Atualizar carrinho com novos valores
      await cartService.saveCart(updatedItems);
      setCartItems(updatedItems);

      // Recalcular totais
      const total = updatedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setTotalItems(total);
      const totalPrice = await cartService.calculateTotal(updatedItems);
      setTotalPrice(totalPrice);
    } catch (error) {
      console.error('Erro ao atualizar preços do carrinho:', error);
    }
  }, [preferredCurrency]);

  /**
   * Carregar carrinho do AsyncStorage
   */
  const loadCart = useCallback(async () => {
    try {
      setLoadingData(true);
      
      // NÃO recarregar moeda aqui - usar a moeda atual do contexto
      // Isso evita resetar para BRL quando não está autenticado
      
      // Buscar itens do carrinho
      const items = await cartService.getCart();
      setCartItems(items);
      
      // Verificar se precisa atualizar preços (se moeda mudou desde que foi adicionado)
      if (items.length > 0 && preferredCurrency) {
        const needsUpdate = items.some(item => {
          // Se item não tem currency ou currency é diferente da preferida atual
          return !item.currency || item.currency !== preferredCurrency;
        });
        
        if (needsUpdate) {
          // Atualizar preços antes de calcular totais
          await updateCartPrices();
          return; // updateCartPrices já calcula os totais
        }
      }
      
      // Calcular totais se não precisou atualizar
      const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setTotalItems(total);
      
      const price = await cartService.calculateTotal(items);
      setTotalPrice(price);
      
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoadingData(false);
    }
  }, [preferredCurrency, updateCartPrices]);

  /**
   * Carregar carrinho ao montar a tela e quando receber foco
   */
  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  /**
   * Atualizar valores convertidos quando moeda preferida mudar
   */
  useEffect(() => {
    if (preferredCurrency && cartItems.length > 0) {
      // Verificar se realmente precisa atualizar
      const needsUpdate = cartItems.some(item => {
        return !item.currency || item.currency !== preferredCurrency;
      });
      
      if (needsUpdate) {
        updateCartPrices();
      }
    }
  }, [preferredCurrency, cartItems, updateCartPrices]);

  /**
   * Remover item do carrinho
   */
  const handleRemoveItem = async (itemId) => {
    Alert.alert(
      'Remover Item',
      'Deseja remover este item do carrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await cartService.removeItem(itemId);
              await loadCart(); // Recarregar carrinho
            } catch (error) {
              console.error('Erro ao remover item:', error);
              Alert.alert('Erro', 'Não foi possível remover o item.');
            }
          },
        },
      ]
    );
  };

  /**
   * Finalizar compra (checkout)
   */
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrinho Vazio', 'Adicione itens ao carrinho antes de finalizar a compra.');
      return;
    }

    // Filtrar apenas produtos válidos ANTES de mostrar confirmação
    // Produtos válidos: têm ID numérico E não são strings mockadas
    const validItems = cartItems.filter(item => {
      if (!item.id) return false;
      const id = parseInt(item.id);
      // Verificar se é um número válido e maior que 0
      return !isNaN(id) && id > 0;
    });

    // Se não houver itens válidos, mostrar erro imediatamente
    if (validItems.length === 0) {
      Alert.alert(
        'Produtos Inválidos',
        'O carrinho contém apenas produtos que não estão disponíveis no sistema.\n\nPor favor, remova os produtos inválidos e adicione produtos reais da lista de produtos disponíveis.',
        [
          { text: 'OK' },
          {
            text: 'Ver Produtos',
            onPress: () => router.push('/search'),
          },
        ]
      );
      return;
    }

    // Calcular total apenas dos produtos válidos
    const validTotal = validItems.reduce((sum, item) => {
      const price = item.convertedPrice || item.price || 0;
      return sum + (price * (item.quantity || 1));
    }, 0);
    const validTotalItems = validItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    // Se houver produtos inválidos, avisar o usuário
    if (validItems.length < cartItems.length) {
      const invalidCount = cartItems.length - validItems.length;
      Alert.alert(
        'Atenção',
        `${invalidCount} produto(s) no carrinho não estão disponíveis e serão removidos.\n\nDeseja finalizar a compra com ${validTotalItems} item(ns) válido(s) por ${preferredCurrency === 'BRL' ? 'R$' : preferredCurrency === 'USD' ? '$' : '€'} ${validTotal.toFixed(2).replace('.', ',')}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Continuar',
            onPress: () => processCheckout(validItems),
          },
        ]
      );
      return;
    }

    // Se todos os produtos são válidos, mostrar confirmação normal
    Alert.alert(
      'Finalizar Compra',
      `Confirmar compra de ${validTotalItems} item(ns) por ${preferredCurrency === 'BRL' ? 'R$' : preferredCurrency === 'USD' ? '$' : '€'} ${validTotal.toFixed(2).replace('.', ',')}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => processCheckout(validItems),
        },
      ]
    );
  };

  /**
   * Processar checkout
   */
  const processCheckout = async (validItems) => {
    try {
      setLoading(true);
      
      // Validar novamente antes de enviar
      const itemsToSend = validItems
        .filter(item => {
          const id = parseInt(item.id);
          // Garantir que ID é válido (número > 0)
          return !isNaN(id) && id > 0;
        })
        .map(item => ({
          productId: parseInt(item.id),
          quantity: item.quantity || 1,
        }));
      
      if (itemsToSend.length === 0) {
        Alert.alert(
          'Erro',
          'Nenhum produto válido encontrado. Por favor, adicione produtos reais da lista de produtos disponíveis.'
        );
        return;
      }
      
      console.log('🛒 Criando pedido com itens:', itemsToSend);
      console.log('   IDs dos produtos:', itemsToSend.map(i => i.productId));
      
      // Criar pedido
      const order = await orderService.createOrder(itemsToSend);
      console.log('✅ Pedido criado com sucesso:', order);
      
      // Limpar carrinho
      await cartService.clearCart();
      
      // Navegar para tela de sucesso
      router.replace('/order-success');
      
    } catch (error) {
      console.error('❌ Erro ao finalizar compra:', error);
      console.error('   Status:', error.status);
      console.error('   Message:', error.message);
      console.error('   Data:', error.data);
      
      // Mensagem de erro mais específica
      let errorMessage = 'Não foi possível finalizar a compra.';
      let errorTitle = 'Erro ao Finalizar Compra';
      
      if (error.status === 500) {
        const errorTrace = error.data?.trace || error.data?.error || error.message || '';
        
        if (errorTrace.includes('Produto Não Encontrado') || 
            errorTrace.includes('Product not found') ||
            errorTrace.includes('Produto não encontrado')) {
          errorTitle = 'Produto Não Encontrado';
          errorMessage = 'Um ou mais produtos no carrinho não existem mais no sistema.\n\nPor favor:\n1. Remova produtos inválidos do carrinho\n2. Adicione apenas produtos da lista de produtos disponíveis\n3. Tente novamente';
        } else {
          errorMessage = 'Erro no servidor ao processar o pedido.\n\nVerifique:\n- Se os produtos ainda estão disponíveis\n- Se o backend está funcionando corretamente';
        }
      } else if (error.status === 404) {
        errorTitle = 'Produto Não Encontrado';
        errorMessage = 'Produto não encontrado no sistema. Por favor, remova produtos inválidos do carrinho.';
      } else if (error.status === 401 || error.status === 403) {
        errorTitle = 'Não Autorizado';
        errorMessage = 'Você não está autorizado para realizar esta operação. Faça login novamente.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(errorTitle, errorMessage, [
        { text: 'OK' },
        {
          text: 'Ver Produtos',
          onPress: () => router.push('/search'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      if (path === 'back') {
        router.back();
      } else {
        router.push(path);
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
        <Text style={styles.headerTitle}>Carrinho</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção Minha Sacola */}
        <View style={styles.bagSection}>
          <View style={styles.bagHeader}>
            <Text style={styles.bagTitle}>Minha Sacola</Text>
            <Text style={styles.itemsCount}>Itens: {totalItems}</Text>
          </View>

          {/* Lista de Itens do Carrinho */}
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <View key={item.id} style={styles.itemWrapper}>
                <View style={styles.itemCard}>
                  {/* Imagem do Produto */}
                  <View style={styles.itemImageContainer}>
                    {item.imageUrl ? (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.itemImagePlaceholder}>📦</Text>
                    )}
                  </View>

                  {/* Informações do Produto */}
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDescription} numberOfLines={2}>
                      {item.description || ''}
                    </Text>
                    <Text style={styles.itemPrice}>
                      {(() => {
                        // Usar moeda do item se disponível, senão usar preferredCurrency
                        const currency = item.currency || preferredCurrency || 'BRL';
                        const symbol = currency === 'BRL' ? 'R$' : currency === 'USD' ? '$' : '€';
                        const price = (item.convertedPrice || item.price || 0).toFixed(2).replace('.', ',');
                        return `${symbol} ${price}`;
                      })()}
                    </Text>
                    {item.quantity > 1 && (
                      <Text style={styles.itemQuantity}>Qtd: {item.quantity}</Text>
                    )}
                  </View>
                </View>
                
                {/* Link Remover Item */}
                <TouchableOpacity 
                  style={styles.removeItemButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Text style={styles.removeItemText}>Remover Item</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCartText}>Seu carrinho está vazio</Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => handleNavigation('/home')}
              >
                <Text style={styles.browseButtonText}>Explorar Produtos</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Seção de Resumo */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Quantidade</Text>
            <Text style={styles.summaryValue}>{totalItems} item</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryTotal}>
              {(() => {
                // Usar moeda do primeiro item se disponível, senão usar preferredCurrency
                const currency = cartItems.length > 0 && cartItems[0].currency 
                  ? cartItems[0].currency 
                  : preferredCurrency || 'BRL';
                const symbol = currency === 'BRL' ? 'R$' : currency === 'USD' ? '$' : '€';
                const price = totalPrice.toFixed(2).replace('.', ',');
                return `${symbol} ${price}`;
              })()}
            </Text>
          </View>

          {/* Botão Finalizar Compra */}
          <TouchableOpacity 
            style={[styles.checkoutButton, cartItems.length === 0 && styles.checkoutButtonDisabled]}
            onPress={handleCheckout}
            disabled={cartItems.length === 0 || loading}
          >
            <Text style={styles.checkoutButtonText}>
              {loading ? 'Processando...' : 'Finalizar Compra'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

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
    flexGrow: 1,
    paddingBottom: 20,
  },
  bagSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  bagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bagTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
  },
  itemsCount: {
    fontSize: 14,
    color: '#792F14',
  },
  itemWrapper: {
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
  itemCard: {
    backgroundColor: '#FFF7DD',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
  },
  itemImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#FAEDC3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemImage: {
    fontSize: 45,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#8B6F47',
    marginBottom: 6,
    lineHeight: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
  },
  removeItemButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  removeItemText: {
    fontSize: 14,
    color: '#792F14',
    fontWeight: '500',
  },
  summarySection: {
    backgroundColor: '#FFF7DD',
    marginHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#792F14',
    fontWeight: '400',
  },
  summaryValue: {
    fontSize: 14,
    color: '#792F14',
    fontWeight: '400',
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
  },
  checkoutButton: {
    backgroundColor: '#792F14',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  itemImagePlaceholder: {
    fontSize: 45,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#8B6F47',
    marginTop: 4,
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#8B6F47',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#792F14',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
  },
});

