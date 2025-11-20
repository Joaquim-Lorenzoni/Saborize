import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dados dos planos disponíveis
const plansData = {
  'fast-food': {
    id: 1,
    name: 'Plano de Fast Food Saborize',
    emoji: '🍔',
    description: 'Por apenas R$ 30/mês recebe cupons com descontos exclusivos em diversos restaurantes de fast food da cidade.',
    price: 30.00,
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
    emoji: '🥗',
    description: 'Por apenas R$ 25/mês recebe cupons com descontos exclusivos em restaurantes saudáveis e opções nutritivas da cidade.',
    price: 25.00,
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
    emoji: '🍰',
    description: 'Por apenas R$ 35/mês recebe cupons com descontos exclusivos em diversas tortarias e confeitarias da cidade.',
    price: 35.00,
    restaurants: [
      'Torta Doce',
      'Confeitaria Central',
      'Doces & Sabores',
      'Tortaria Artesanal',
      'Doce Vida',
    ],
  },
};

export default function PlanDetailsScreen() {
  const params = useLocalSearchParams();
  const [showRestaurants, setShowRestaurants] = useState(false);

  // Tratar parâmetros que podem vir como array ou string
  const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
  const isAdminParam = Array.isArray(params.isAdmin) ? params.isAdmin[0] : params.isAdmin;

  // Buscar dados do plano ou usar padrão
  const plan = plansData[planId] || plansData['fast-food'];
  
  // Verificar se é admin e se o plano pode ser editado
  const isAdminView = isAdminParam === 'true' || isAdminParam === true;
  const editablePlans = ['fast-food', 'saudavel', 'tortaria'];
  const canEdit = isAdminView && planId && editablePlans.includes(String(planId));
  
  // Debug - remover depois
  if (isAdminView) {
    console.log('Admin view detected:', { planId, isAdminParam, canEdit, editablePlans });
  }

  const handleAddToCart = () => {
    // TODO: Implementar lógica de adicionar ao carrinho
    // Por enquanto, apenas navega para o carrinho
    router.push('/cart');
  };

  const handleEditPlan = () => {
    // TODO: Implementar navegação para edição do plano
    // Por enquanto, navega para a tela de adicionar plano com dados preenchidos
    router.push({ 
      pathname: '/add-plan', 
      params: { 
        editMode: 'true',
        planId: planId,
        title: plan.name,
        description: plan.description,
      } 
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7A4F3B" />
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
          <Text style={styles.planEmoji}>{plan.emoji}</Text>
        </View>

        {/* Descrição do Plano */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{plan.description}</Text>
        </View>

        {/* Dropdown "Onde aceita" */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowRestaurants(!showRestaurants)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>Onde aceita</Text>
            <MaterialIcons 
              name={showRestaurants ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#7A4F3B" 
            />
          </TouchableOpacity>

          {/* Lista de Restaurantes (expandível) */}
          {showRestaurants && (
            <View style={styles.restaurantsList}>
              {plan.restaurants.map((restaurant, index) => (
                <View key={index} style={styles.restaurantItem}>
                  <MaterialIcons name="restaurant" size={20} color="#7A4F3B" />
                  <Text style={styles.restaurantName}>{restaurant}</Text>
                </View>
              ))}
            </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F0E3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EADDCB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#7A4F3B',
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
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginBottom: 20,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#EADDCB',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#7A4F3B',
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
    color: '#7A4F3B',
    fontWeight: '600',
  },
  planEmoji: {
    fontSize: 120,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#7A4F3B',
    textAlign: 'center',
  },
  dropdownContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADDCB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 16,
    color: '#7A4F3B',
    fontWeight: '500',
  },
  restaurantsList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADDCB',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 8,
    marginTop: -1,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F0E3',
  },
  restaurantName: {
    fontSize: 15,
    color: '#7A4F3B',
    marginLeft: 12,
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F0E3',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: '#EADDCB',
  },
  addToCartButton: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

