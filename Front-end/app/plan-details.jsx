import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import cartService from '../services/cart.service';
import planService from '../services/plan.service';

// Dados dos planos disponíveis
const plansData = {
  'fast-food': {
    id: 1,
    name: 'Plano de Fast Food Saborize',
    image: require('../assets/images/FAST FOOD.png'),
    priceText: 'R$ 10/mês',
    coupons: '5 cupons de 25% de desconto',
    validity: 'até no máximo R$ 10,00.',
    savings: 'cerca de R$ 40,00',
    frequency: 'todos mês.',
    price: 10.00,
    restaurants: [
      'McDonald\'s',
      'Burger King',
      'Subway',
      'KFC',
      'Giraffas',
      'Bob\'s',
    ],
  },
  'saudavel': {
    id: 2,
    name: 'Plano Saudável Saborize',
    image: require('../assets/images/SAUDAVEL.png'),
    priceText: 'R$ 10/mês',
    coupons: '5 cupons de 25% de desconto',
    validity: 'até no máximo R$ 10,00.',
    savings: 'cerca de R$ 40,00',
    frequency: 'todos mês.',
    price: 10.00,
    restaurants: [
      'Green Kitchen',
      'Salad Bowl',
      'Vida Saudável',
      'Natureza',
      'Verde Vida',
    ],
  },
  'tortaria': {
    id: 3,
    name: 'Plano Tortaria Saborize',
    image: require('../assets/images/TORTA.png'),
    priceText: 'R$ 10/mês',
    coupons: '5 cupons de 25% de desconto',
    validity: 'até no máximo R$ 10,00.',
    savings: 'cerca de R$ 40,00',
    frequency: 'todos mês.',
    price: 10.00,
    restaurants: [
      'Torta Doce',
      'Confeitaria Central',
      'Doces & Sabores',
      'Tortaria Artesanal',
      'Doce Vida',
    ],
  },
  'italiana': {
    id: 4,
    name: 'Plano Italiana Saborize',
    image: require('../assets/images/ITALIANO.png'),
    priceText: 'R$ 10/mês',
    coupons: '5 cupons de 25% de desconto',
    validity: 'até no máximo R$ 10,00.',
    savings: 'cerca de R$ 40,00',
    frequency: 'todos mês.',
    price: 10.00,
    restaurants: [
      'Nonna Pasta',
      'La Trattoria',
      'Bella Italia',
      'Pizza & Pasta',
      'Ristorante Romano',
    ],
  },
  'asiatica': {
    id: 5,
    name: 'Plano Comida Asiática Saborize',
    image: require('../assets/images/SUSHI.png'),
    priceText: 'R$ 10/mês',
    coupons: '5 cupons de 25% de desconto',
    validity: 'até no máximo R$ 10,00.',
    savings: 'cerca de R$ 40,00',
    frequency: 'todos mês.',
    price: 10.00,
    restaurants: [
      'Sushi Bar',
      'Tokyo Taste',
      'China in Box',
      'Thai Express',
      'Asia Food',
    ],
  },
  'drinkeries': {
    id: 6,
    name: 'Plano Drinkeria Saborize',
    image: require('../assets/images/DRINKS.png'),
    priceText: 'R$ 10/mês',
    coupons: '5 cupons de 25% de desconto',
    validity: 'até no máximo R$ 10,00.',
    savings: 'cerca de R$ 40,00',
    frequency: 'todos mês.',
    price: 10.00,
    restaurants: [
      'Bar do João',
      'Drinks & Co',
      'Tropical Bar',
      'Lounge 21',
      'Happy Hour',
    ],
  },
  'vegetariano': {
    id: 7,
    name: 'Plano Vegetariano Saborize',
    image: require('../assets/images/VEGETARIANO.png'),
    priceText: 'R$ 10/mês',
    coupons: '5 cupons de 25% de desconto',
    validity: 'até no máximo R$ 10,00.',
    savings: 'cerca de R$ 40,00',
    frequency: 'todos mês.',
    price: 10.00,
    restaurants: [
      'Veggie Life',
      'Green Garden',
      'Plant Power',
      'Vegano & Cia',
      'Natural Food',
    ],
  },
  'mexicana': {
    id: 8,
    name: 'Plano Mexicana Saborize',
    image: require('../assets/images/MEXICANO.png'),
    priceText: 'R$ 10/mês',
    coupons: '5 cupons de 25% de desconto',
    validity: 'até no máximo R$ 10,00.',
    savings: 'cerca de R$ 40,00',
    frequency: 'todos mês.',
    price: 10.00,
    restaurants: [
      'Taco Bell',
      'El Mariachi',
      'Cantina Mexicana',
      'Burrito Express',
      'Sabor Mexicano',
    ],
  },
  'churrascaria': {
    id: 9,
    name: 'Plano Churrascaria Saborize',
    image: require('../assets/images/CHURRASCO.png'),
    priceText: 'R$ 10/mês',
    coupons: '5 cupons de 25% de desconto',
    validity: 'até no máximo R$ 10,00.',
    savings: 'cerca de R$ 40,00',
    frequency: 'todos mês.',
    price: 10.00,
    restaurants: [
      'Grill Master',
      'Churrasco Premium',
      'Espeto de Ouro',
      'Pampa Grill',
      'Carne & Brasa',
    ],
  },
  'padaria': {
    id: 10,
    name: 'Plano Cafeteria Saborize',
    image: require('../assets/images/CAFE.png'),
    priceText: 'R$ 10/mês',
    coupons: '5 cupons de 25% de desconto',
    validity: 'até no máximo R$ 10,00.',
    savings: 'cerca de R$ 40,00',
    frequency: 'todos mês.',
    price: 10.00,
    restaurants: [
      'Pão Quente',
      'Cafeteria Central',
      'Arte do Pão',
      'Delícias da Manhã',
      'Cafeteria Moderna',
    ],
  },
};

export default function PlanDetailsScreen() {
  const params = useLocalSearchParams();
  const [showRestaurants, setShowRestaurants] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [product, setProduct] = useState(null);
  const { preferredCurrency } = useCurrency();

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

  // Tratar parâmetros que podem vir como array ou string
  const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
  const isAdminParam = Array.isArray(params.isAdmin) ? params.isAdmin[0] : params.isAdmin;
  
  const { isAdmin: userIsAdmin } = useAuth();
  
  // Verificar se pode editar (apenas admin e se veio da tela admin)
  const canEdit = userIsAdmin && (isAdminParam === 'true' || isAdminParam === true);
  
  /**
   * Carregar produto da API quando planId mudar
   */
  useEffect(() => {
    if (planId) {
      loadProduct();
    }
  }, [planId]);

  /**
   * Recarregar produto quando moeda preferida mudar
   */
  useEffect(() => {
    if (planId && preferredCurrency) {
      loadProduct();
    }
  }, [preferredCurrency]);

  /**
   * Carregar produto
   */
  const loadProduct = async () => {
    if (!planId) return;
    
    try {
      setLoadingData(true);
      
      // Garantir que temos uma moeda válida
      const validCurrencies = ['BRL', 'USD', 'EUR'];
      const targetCurrency = validCurrencies.includes(preferredCurrency) ? preferredCurrency : 'BRL';
      
      // Se planId for numérico, buscar da API
      const numericId = parseInt(planId);
      if (!isNaN(numericId)) {
        console.log(`📦 Carregando produto ${numericId} da API com moeda ${targetCurrency}...`);
        const productData = await planService.getPlanById(numericId, targetCurrency);
        console.log('✅ Produto carregado da API:', productData);
        setProduct(productData);
      } else {
        // Fallback para dados mockados apenas se for string (compatibilidade com dados antigos)
        console.warn(`⚠️ planId "${planId}" não é numérico, usando dados mockados`);
        const fallbackPlan = plansData[planId] || plansData['fast-food'];
        setProduct({
          id: fallbackPlan.id,
          name: fallbackPlan.name,
          description: `Por apenas ${fallbackPlan.priceText} receba cupons com descontos exclusivos.`,
          price: fallbackPlan.price,
          convertedPrice: fallbackPlan.price,
          currency: 'BRL',
          imageUrl: null,
          restaurants: fallbackPlan.restaurants.map(name => ({ name })),
        });
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar produto:', error);
      
      // Se for admin e o produto não existir, mostrar erro específico
      if (canEdit) {
        Alert.alert(
          'Erro',
          `Não foi possível carregar o produto ID: ${planId}. Verifique se o produto existe no backend.`,
          [
            { text: 'OK' },
            {
              text: 'Voltar',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do produto.');
      }
      
      // Fallback para dados mockados apenas se não for admin
      if (!canEdit) {
        const fallbackPlan = plansData[planId] || plansData['fast-food'];
        setProduct({
          id: fallbackPlan.id,
          name: fallbackPlan.name,
          description: `Por apenas ${fallbackPlan.priceText} receba cupons com descontos exclusivos.`,
          price: fallbackPlan.price,
          convertedPrice: fallbackPlan.price,
          currency: 'BRL',
          imageUrl: null,
          restaurants: fallbackPlan.restaurants.map(name => ({ name })),
        });
      }
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Adicionar ao carrinho
   */
  const handleAddToCart = async () => {
    if (!product) {
      Alert.alert('Erro', 'Produto não encontrado.');
      return;
    }

    try {
      setLoading(true);
      
      // Garantir que temos uma moeda válida
      const validCurrencies = ['BRL', 'USD', 'EUR'];
      const targetCurrency = validCurrencies.includes(preferredCurrency) ? preferredCurrency : 'BRL';
      
      await cartService.addItem({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price || 0, // Preço original na moeda do produto
        convertedPrice: product.convertedPrice || product.price || 0, // Preço convertido
        currency: targetCurrency, // Moeda usada para conversão
        imageUrl: product.imageUrl,
        quantity: 1,
      });
      
      Alert.alert(
        'Sucesso',
        'Produto adicionado ao carrinho!',
        [
          { text: 'Continuar Comprando', style: 'cancel' },
          {
            text: 'Ver Carrinho',
            onPress: () => {
              // Forçar atualização do badge antes de navegar
              setTimeout(() => {
                router.push('/cart');
              }, 100);
            },
          },
        ]
      );
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o produto ao carrinho.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Editar plano (apenas admin)
   */
  const handleEditPlan = () => {
    if (!product || !canEdit) {
      return;
    }
    
    // Navegar para tela de edição com os dados do produto
    handleNavigation('/add-plan', {
      editMode: 'true',
      planId: String(product.id),
      title: product.name,
      description: product.description,
    });
  };
  
  // Usar produto da API ou fallback
  const displayProduct = product || {
    name: 'Carregando...',
    description: '',
    price: 0,
    convertedPrice: 0,
    restaurants: [],
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleNavigation('back')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#792F14" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {displayProduct.name}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Imagem do Plano */}
        <View style={styles.imageContainer}>
          {canEdit && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditPlan}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Editar plano</Text>
            </TouchableOpacity>
          )}
          {displayProduct.imageUrl ? (
            <Image 
              source={{ uri: displayProduct.imageUrl }}
              style={styles.planImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.planImagePlaceholder}>
              <Text style={styles.planImagePlaceholderText}>📦</Text>
            </View>
          )}
        </View>

        {/* Descrição do Plano */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {displayProduct.description || 'Descrição do produto não disponível.'}
          </Text>
          
          <Text style={styles.priceText}>
            {preferredCurrency === 'BRL' ? 'R$' : preferredCurrency === 'USD' ? '$' : '€'} {(displayProduct.convertedPrice || displayProduct.price || 0).toFixed(2)}
          </Text>
        </View>

        {/* Dropdown "Onde aceita" */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownHeader}
            onPress={() => setShowRestaurants(!showRestaurants)}
          >
            <Text style={styles.dropdownText}>Onde aceita</Text>
            <MaterialIcons 
              name={showRestaurants ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#792F14" 
            />
          </TouchableOpacity>
          
          {showRestaurants && displayProduct.restaurants && displayProduct.restaurants.length > 0 && (
            <View style={styles.restaurantsList}>
              {displayProduct.restaurants.map((restaurant, index) => (
                <Text key={index} style={styles.restaurantItem}>
                  • {restaurant.name || restaurant}
                </Text>
              ))}
            </View>
          )}
          
          {showRestaurants && (!displayProduct.restaurants || displayProduct.restaurants.length === 0) && (
            <Text style={styles.noRestaurantsText}>Nenhum restaurante associado</Text>
          )}
        </View>

        {/* Espaço para o botão fixo */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Botão Adicionar ao Carrinho (fixo na parte inferior) */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartButtonText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>

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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#792F14',
    marginLeft: 12,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#FAEDC3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    marginBottom: 30,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FAEDC3',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#792F14',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editButtonText: {
    fontSize: 14,
    color: '#792F14',
    fontWeight: '600',
  },
  planImage: {
    width: 120,
    height: 120,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 12,
  },
  highlightText: {
    color: '#792F14',
    fontWeight: '600',
  },
  dropdownContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#792F14',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#792F14',
    fontWeight: '500',
  },
  restaurantsList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  restaurantItem: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    paddingLeft: 8,
  },
  noRestaurantsText: {
    fontSize: 14,
    color: '#8B6F47',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    fontStyle: 'italic',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#792F14',
    marginTop: 12,
  },
  planImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#FAEDC3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planImagePlaceholderText: {
    fontSize: 60,
  },
  bottomSpacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  addToCartButton: {
    backgroundColor: '#792F14',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

