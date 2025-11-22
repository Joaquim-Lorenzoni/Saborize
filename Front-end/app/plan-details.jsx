import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../components/LoadingOverlay';

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

  // Buscar dados do plano ou usar padrão
  const plan = plansData[planId] || plansData['fast-food'];
  
  // Verificar se é admin e se o plano pode ser editado
  const isAdminView = isAdminParam === 'true' || isAdminParam === true;
  const editablePlans = ['fast-food', 'saudavel', 'tortaria', 'italiana', 'asiatica', 'drinkeries', 'vegetariano', 'mexicana', 'churrascaria', 'padaria'];
  const canEdit = isAdminView && planId && editablePlans.includes(String(planId));
  
  // Debug - remover depois
  if (isAdminView) {
    console.log('Admin view detected:', { planId, isAdminParam, canEdit, editablePlans });
  }

  const handleAddToCart = () => {
    // TODO: Implementar lógica de adicionar ao carrinho
    // Por enquanto, apenas navega para o carrinho
    handleNavigation('/cart');
  };

  const handleEditPlan = () => {
    // TODO: Implementar navegação para edição do plano
    // Por enquanto, navega para a tela de adicionar plano com dados preenchidos
    handleNavigation('/add-plan', { 
      editMode: 'true',
      planId: planId,
      title: plan.name,
      description: plan.description,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleNavigation('back')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#792F14" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {plan.name}
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
          <Image 
            source={plan.image}
            style={styles.planImage}
            resizeMode="contain"
          />
        </View>

        {/* Descrição do Plano */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Por apenas <Text style={styles.highlightText}>{plan.priceText}</Text> receba cupons com descontos exclusivos em diversos restaurantes de fast food da cidade.
          </Text>
          
          <Text style={styles.descriptionText}>
            Receba <Text style={styles.highlightText}>{plan.coupons}</Text> de {plan.validity}
          </Text>
          
          <Text style={styles.descriptionText}>
            Economize <Text style={styles.highlightText}>{plan.savings}</Text> {plan.frequency}
          </Text>
        </View>

        {/* Dropdown "Onde aceita" */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownText}>Onde aceita</Text>
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
      <LoadingOverlay visible={loading} />
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
  dropdownText: {
    fontSize: 14,
    color: '#792F14',
    fontWeight: '500',
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

