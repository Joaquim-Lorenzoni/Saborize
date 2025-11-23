import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';
import LoadingOverlay from '../components/LoadingOverlay';

export default function AdminScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path, params = {}) => {
    setLoading(true);
    setTimeout(() => {
      router.push({ pathname: path, params });
      setLoading(false);
    }, 200);
  };

  const planCategories = [
    { id: 1, name: 'Fast Food', emoji: '🍔', planId: 'fast-food' },
    { id: 2, name: 'Saudável', emoji: '🥗', planId: 'saudavel' },
    { id: 3, name: 'Tortaria', emoji: '🍰', planId: 'tortaria' },
    { id: 4, name: 'Italiana', emoji: '🍝', planId: 'fast-food' }, // Fallback - pode criar depois
    { id: 5, name: 'Comida Asiática', emoji: '🍣', planId: 'fast-food' }, // Fallback
    { id: 6, name: 'Drinkerias', emoji: '🍹', planId: 'fast-food' }, // Fallback
    { id: 7, name: 'Vegetariana', emoji: '🥙', planId: 'saudavel' }, // Fallback
    { id: 8, name: 'Mexicana', emoji: '🌮', planId: 'fast-food' }, // Fallback
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tela admin</Text>
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

        {/* Botão Adicionar Novo Plano */}
        <TouchableOpacity 
          style={styles.addPlanButton}
          onPress={() => handleNavigation('/add-plan')}
        >
          <MaterialIcons name="add" size={24} color="#FF6B35" />
          <Text style={styles.addPlanButtonText}>Adicionar um novo plano</Text>
        </TouchableOpacity>

        {/* Grid de Categorias de Planos */}
        <View style={styles.categoriesGrid}>
          {planCategories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCard}
              onPress={() => handleNavigation('/plan-details', { 
                planId: category.planId,
                isAdmin: 'true'
              })}
            >
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Barra de Navegação Inferior */}
      <BottomNavBar activeRoute="home" />

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} />
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
    paddingBottom: 100,
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
    backgroundColor: '#EADDCB',
    paddingVertical: 12,
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
    backgroundColor: '#FFFFFF',
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
  addPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFF8F5',
  },
  addPlanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
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
    backgroundColor: '#FFFFFF',
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
});

