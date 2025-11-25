import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import LoadingOverlay from '../components/LoadingOverlay';
import { useCurrency } from '../contexts/CurrencyContext';
import planService from '../services/plan.service';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [products, setProducts] = useState([]);
  const { preferredCurrency } = useCurrency();

  const handleNavigation = (path, params = {}) => {
    setLoading(true);
    setTimeout(() => {
      router.push({ pathname: path, params });
      setLoading(false);
    }, 200);
  };

  /**
   * Carregar produtos ao montar a tela
   */
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Recarregar produtos quando moeda preferida mudar
   */
  useEffect(() => {
    const currency = preferredCurrency || 'BRL';
    loadProducts(currency);
  }, [preferredCurrency]);

  /**
   * Carregar dados iniciais
   */
  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      
      // Não recarregar moeda aqui - usar a moeda atual do contexto
      // Isso evita resetar para BRL quando não está autenticado
      
      // Carregar produtos com moeda atual ou BRL como padrão
      const currency = preferredCurrency || 'BRL';
      await loadProducts(currency);
      
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
    // Garantir que sempre temos uma moeda válida
    const validCurrencies = ['BRL', 'USD', 'EUR'];
    const currency = validCurrencies.includes(targetCurrency) ? targetCurrency : 'BRL';
    
    try {
      console.log('📦 Carregando produtos com moeda:', currency);
      const response = await planService.getAllPlans(currency, {
        page: 0,
        size: 100, // Buscar muitos produtos para filtrar no frontend
        sort: 'description,ASC',
      });
      
      // Se for paginação, pegar o conteúdo
      const productsList = response.content || response || [];
      console.log('✅ Produtos carregados:', productsList.length);
      console.log('📋 Primeiros produtos:', productsList.slice(0, 3).map(p => p.name));
      setProducts(productsList);
      
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      setProducts([]);
    }
  };

  /**
   * Filtrar produtos baseado na busca
   */
  const filteredResults = searchQuery.trim()
    ? products.filter(product => {
        if (!product) return false;
        
        const query = searchQuery.toLowerCase().trim();
        const name = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        
        const matchesName = name.includes(query);
        const matchesDescription = description.includes(query);
        
        return matchesName || matchesDescription;
      })
    : [];

  // Debug: Log quando buscar
  useEffect(() => {
    if (searchQuery.trim()) {
      console.log('🔍 Buscando:', searchQuery);
      console.log('📦 Total de produtos:', products.length);
      console.log('✅ Resultados encontrados:', filteredResults.length);
    }
  }, [searchQuery, products.length, filteredResults.length]);


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

        {/* Resultados da Busca ou Grid de Produtos */}
        {searchQuery.trim() ? (
          // Se há busca ativa, mostrar resultados filtrados
          filteredResults.length > 0 ? (
            <View style={styles.resultsContainer}>
              {filteredResults.map((product) => (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.resultCard}
                  onPress={() => handleNavigation('/plan-details', { planId: product.id })}
                >
                  <View style={styles.resultImageContainer}>
                    {product.imageUrl ? (
                      <Image 
                        source={{ uri: product.imageUrl }}
                        style={styles.resultImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.resultImagePlaceholder}>
                        <Text style={styles.resultImagePlaceholderText}>📦</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{product.name}</Text>
                    <Text style={styles.resultDescription} numberOfLines={2}>
                      {product.description}
                    </Text>
                    <Text style={styles.resultPrice}>
                      {preferredCurrency === 'BRL' ? 'R$' : preferredCurrency === 'USD' ? '$' : '€'} {(product.convertedPrice || product.price || 0).toFixed(2).replace('.', ',')}
                    </Text>
                    <TouchableOpacity 
                      style={styles.addButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleNavigation('/plan-details', { planId: product.id });
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
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>Nenhum resultado encontrado</Text>
            </View>
          )
        ) : (
          // Se não há busca, mostrar todos os produtos em grid
          products.length > 0 ? (
            <View style={styles.productsGrid}>
              {products.map((product) => (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.productCard}
                  onPress={() => handleNavigation('/plan-details', { planId: product.id })}
                >
                  <View style={styles.productImageContainer}>
                    {product.imageUrl ? (
                      <Image 
                        source={{ uri: product.imageUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.productImagePlaceholder}>
                        <Text style={styles.productImagePlaceholderText}>📦</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <Text style={styles.productPrice}>
                      {preferredCurrency === 'BRL' ? 'R$' : preferredCurrency === 'USD' ? '$' : '€'} {(product.convertedPrice || product.price || 0).toFixed(2).replace('.', ',')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>Nenhum plano disponível no momento.</Text>
            </View>
          )
        )}

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Barra de Navegação Inferior */}
      <BottomNavBar activeRoute="search" />

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
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    width: '100%',
    height: 140,
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
    backgroundColor: '#FAEDC3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImagePlaceholderText: {
    fontSize: 40,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    marginBottom: 8,
    minHeight: 40,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#792F14',
  },
  emptyStateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8B6F47',
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
  resultImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FAEDC3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultImagePlaceholderText: {
    fontSize: 40,
  },
});

