import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Fast Food', emoji: '🍔' },
    { id: 2, name: 'Saudável', emoji: '🥗' },
    { id: 3, name: 'Tortaria', emoji: '🍰' },
    { id: 4, name: 'Italiana', emoji: '🍝' },
    { id: 5, name: 'Comida Asiática', emoji: '🍣' },
    { id: 6, name: 'Drinkeries', emoji: '🍹' },
    { id: 7, name: 'Vegetariano', emoji: '🥙' },
    { id: 8, name: 'Comida mexicana', emoji: '🌮' },
    { id: 9, name: 'Churrascaria', emoji: '🥩' },
    { id: 10, name: 'Padaria', emoji: '🥐' },
  ];

  // Dados mockados de planos disponíveis para busca
  const availablePlans = [
    {
      id: 1,
      name: 'Plano Fast Food',
      description: 'Disponível 24 horas, diversas variedades.',
      price: 30.00,
      category: 'Fast Food',
      emoji: '🍔',
      planId: 'fast-food',
    },
    {
      id: 2,
      name: 'Plano Saudável',
      description: 'Opções leves e nutritivas para o seu dia.',
      price: 25.00,
      category: 'Saudável',
      emoji: '🥗',
      planId: 'saudavel',
    },
    {
      id: 3,
      name: 'Plano Tortaria',
      description: 'Doces e sobremesas deliciosas.',
      price: 35.00,
      category: 'Tortaria',
      emoji: '🍰',
      planId: 'tortaria',
    },
    {
      id: 4,
      name: 'Plano Italiana',
      description: 'Massas e pratos autênticos italianos.',
      price: 40.00,
      category: 'Italiana',
      emoji: '🍝',
      planId: 'fast-food', // Fallback para italiano (não existe ainda)
    },
  ];

  // Filtrar resultados baseado na busca
  const filteredResults = searchQuery.trim()
    ? availablePlans.filter(plan =>
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tela Pesquisar</Text>
        </View>

        {/* Indicador de Localização */}
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={20} color="#FF4444" />
          <Text style={styles.locationText}>Passo Fundo, RS</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#7A4F3B" />
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Busque um plano aqui"
            placeholderTextColor="#9D7A6B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <MaterialIcons name="close" size={20} color="#9D7A6B" />
            </TouchableOpacity>
          ) : null}
          <MaterialIcons name="search" size={24} color="#9D7A6B" style={styles.searchIcon} />
        </View>

        {/* Resultados da Busca ou Grid de Categorias */}
        {searchQuery.trim() && filteredResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            {filteredResults.map((plan) => (
              <TouchableOpacity 
                key={plan.id} 
                style={styles.resultCard}
                onPress={() => router.push({ pathname: '/plan-details', params: { planId: plan.planId } })}
              >
                <View style={styles.resultImageContainer}>
                  <Text style={styles.resultEmoji}>{plan.emoji}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{plan.name}</Text>
                  <Text style={styles.resultDescription}>{plan.description}</Text>
                  <Text style={styles.resultPrice}>R$ {plan.price.toFixed(2).replace('.', ',')}</Text>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push({ pathname: '/plan-details', params: { planId: plan.planId } });
                    }}
                  >
                    <MaterialIcons name="shopping-cart" size={18} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Adicionar</Text>
                  </TouchableOpacity>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#7A4F3B" style={styles.arrowIcon} />
              </TouchableOpacity>
            ))}
          </View>
        ) : searchQuery.trim() && filteredResults.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>Nenhum resultado encontrado</Text>
          </View>
        ) : (
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Barra de Navegação Inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/home')}
        >
          <MaterialIcons name="home" size={28} color="#9D7A6B" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/search')}
        >
          <View style={styles.activeNavItem}>
            <MaterialIcons name="search" size={28} color="#E07A5F" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/coupons')}
        >
          <MaterialIcons name="local-offer" size={28} color="#9D7A6B" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/cart')}
        >
          <View style={styles.cartContainer}>
            <MaterialIcons name="shopping-cart" size={28} color="#9D7A6B" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 14,
    color: '#9D7A6B',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A4F3B',
    marginLeft: 6,
    marginRight: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EADDCB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#7A4F3B',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#EADDCB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    minHeight: 140,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A4F3B',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 80,
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
    backgroundColor: '#FFFFFF',
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
  resultsContainer: {
    paddingHorizontal: 20,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#EADDCB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultEmoji: {
    fontSize: 40,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7A4F3B',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: '#9D7A6B',
    marginBottom: 8,
    lineHeight: 18,
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A4F3B',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#7A4F3B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  noResultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#9D7A6B',
  },
});

