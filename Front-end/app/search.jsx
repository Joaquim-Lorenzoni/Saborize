import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import LoadingOverlay from '../components/LoadingOverlay';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path, params = {}) => {
    setLoading(true);
    setTimeout(() => {
      router.push({ pathname: path, params });
      setLoading(false);
    }, 200);
  };

  const categories = [
    { id: 1, name: 'Fast Food', image: require('../assets/images/FAST FOOD.png'), planId: 'fast-food' },
    { id: 2, name: 'Saudável', image: require('../assets/images/SAUDAVEL.png'), planId: 'saudavel' },
    { id: 3, name: 'Tortaria', image: require('../assets/images/TORTA.png'), planId: 'tortaria' },
    { id: 4, name: 'Italiana', image: require('../assets/images/ITALIANO.png'), planId: 'italiana' },
    { id: 5, name: 'Comida Asiática', image: require('../assets/images/SUSHI.png'), planId: 'asiatica' },
    { id: 6, name: 'Drinkerias', image: require('../assets/images/DRINKS.png'), planId: 'drinkeries' },
    { id: 7, name: 'Vegetariano', image: require('../assets/images/VEGETARIANO.png'), planId: 'vegetariano' },
    { id: 8, name: 'Comida mexicana', image: require('../assets/images/MEXICANO.png'), planId: 'mexicana' },
    { id: 9, name: 'Churrascaria', image: require('../assets/images/CHURRASCO.png'), planId: 'churrascaria' },
    { id: 10, name: 'Cafeteria', image: require('../assets/images/CAFE.png'), planId: 'padaria' },
  ];

  // Dados mockados de planos disponíveis para busca
  const availablePlans = [
    {
      id: 1,
      name: 'Plano Fast Food',
      description: 'Disponível 24 horas, diversas variedades.',
      price: 10.00,
      category: 'Fast Food',
      image: require('../assets/images/FAST FOOD.png'),
      planId: 'fast-food',
    },
    {
      id: 2,
      name: 'Plano Saudável',
      description: 'Opções leves e nutritivas para o seu dia.',
      price: 10.00,
      category: 'Saudável',
      image: require('../assets/images/SAUDAVEL.png'),
      planId: 'saudavel',
    },
    {
      id: 3,
      name: 'Plano Tortaria',
      description: 'Doces e sobremesas deliciosas.',
      price: 10.00,
      category: 'Tortaria',
      image: require('../assets/images/TORTA.png'),
      planId: 'tortaria',
    },
    {
      id: 4,
      name: 'Plano Italiana',
      description: 'Massas e pratos autênticos italianos.',
      price: 10.00,
      category: 'Italiana',
      emoji: '🍝',
      planId: 'italiana',
    },
    {
      id: 5,
      name: 'Plano Comida Asiática',
      description: 'Sabores orientais únicos.',
      price: 10.00,
      category: 'Comida Asiática',
      emoji: '🍣',
      planId: 'asiatica',
    },
    {
      id: 6,
      name: 'Plano Drinkeria',
      description: 'Drinks e bebidas especiais.',
      price: 10.00,
      category: 'Drinkeria',
      emoji: '🍹',
      planId: 'drinkeries',
    },
    {
      id: 7,
      name: 'Plano Vegetariano',
      description: 'Opções vegetarianas deliciosas.',
      price: 10.00,
      category: 'Vegetariano',
      emoji: '🥙',
      planId: 'vegetariano',
    },
    {
      id: 8,
      name: 'Plano Mexicana',
      description: 'Sabores mexicanos autênticos.',
      price: 10.00,
      category: 'Comida mexicana',
      emoji: '🌮',
      planId: 'mexicana',
    },
    {
      id: 9,
      name: 'Plano Churrascaria',
      description: 'As melhores carnes da cidade.',
      price: 10.00,
      category: 'Churrascaria',
      emoji: '🥩',
      planId: 'churrascaria',
    },
    {
      id: 10,
      name: 'Plano Cafeteria',
      description: 'Pães e doces fresquinhos.',
      price: 10.00,
      category: 'Cafeteria',
      emoji: '🥐',
      planId: 'padaria',
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
    <View style={styles.container}>
      {/* Seção Amarela do Topo */}
      <View style={styles.topSection}>
        {/* Indicador de Localização */}
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={20} color="#FF4444" />
          <Text style={styles.locationText}>Passo Fundo, RS</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#792F14" />
        </View>
      </View>

      {/* Container Branco com Bordas Arredondadas */}
      <ScrollView 
        style={styles.whiteContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Busque um plano aqui"
            placeholderTextColor="#8B6F47"
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

        {/* Resultados da Busca ou Grid de Categorias */}
        {searchQuery.trim() && filteredResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            {filteredResults.map((plan) => (
              <TouchableOpacity 
                key={plan.id} 
                style={styles.resultCard}
                onPress={() => handleNavigation('/plan-details', { planId: plan.planId })}
              >
                <View style={styles.resultImageContainer}>
                  <Image 
                    source={plan.image}
                    style={styles.resultImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{plan.name}</Text>
                  <Text style={styles.resultDescription}>{plan.description}</Text>
                  <Text style={styles.resultPrice}>R$ {plan.price.toFixed(2).replace('.', ',')}</Text>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleNavigation('/plan-details', { planId: plan.planId });
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
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => handleNavigation('/plan-details', { planId: category.planId })}
              >
                <View style={styles.categoryImageContainer}>
                  <Image 
                    source={category.image}
                    style={styles.categoryImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.categoryNameContainer}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Barra de Navegação Inferior */}
      <BottomNavBar activeRoute="search" />

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} />
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    marginLeft: 6,
    marginRight: 4,
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#FFF7DD',
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
    minHeight: 110,
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
  categoryImageContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: 70,
    height: 70,
  },
  categoryNameContainer: {
    width: '100%',
    backgroundColor: '#FAEDC3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0E0C0',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 130,
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF7DD',
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
    backgroundColor: '#FAEDC3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultImage: {
    width: 60,
    height: 60,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#792F14',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: '#8B6F47',
    marginBottom: 8,
    lineHeight: 18,
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#792F14',
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
    color: '#8B6F47',
  },
});

