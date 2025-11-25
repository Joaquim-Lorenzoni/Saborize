import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAuth } from '../contexts/AuthContext';
import cloudinaryService from '../services/cloudinary.service';
import planService from '../services/plan.service';
import restaurantService from '../services/restaurant.service';
import userService from '../services/user.service';

const MAX_DESCRIPTION_LENGTH = 200;

// Dados do plano (precisa de alteração anda)
const plansData = {
  'fast-food': {
    restaurants: ['McDonald\'s', 'Burger King', 'Subway', 'KFC', 'Giraffas', 'Bob\'s'],
  },
  'saudavel': {
    restaurants: ['Green Kitchen', 'Salad Bowl', 'Vida Saudável', 'Natureza', 'Verde Vida'],
  },
  'tortaria': {
    restaurants: ['Torta Doce', 'Confeitaria Central', 'Doces & Sabores', 'Tortaria Artesanal', 'Doce Vida'],
  },
};

export default function AddPlanScreen() {
  const { editMode, planId, title: initialTitle, description: initialDescription } = useLocalSearchParams();
  const isEditMode = editMode === 'true';
  const { isAdmin } = useAuth();
  
  const [title, setTitle] = useState(initialTitle || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('BRL');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null); // URI local para preview
  const [uploadingImage, setUploadingImage] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [availableRestaurants, setAvailableRestaurants] = useState([]);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      router.back();
      setLoading(false);
    }, 200);
  };

  /**
   * Verificar se usuário é admin
   */
  useEffect(() => {
    if (!isAdmin) {
      Alert.alert(
        'Acesso Negado',
        'Você não tem permissão para acessar esta tela.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [isAdmin]);

  /**
   * Carregar dados iniciais
   */
  useEffect(() => {
    if (isAdmin) {
      loadInitialData();
    }
  }, [isAdmin, isEditMode, planId]);

  /**
   * Carregar dados iniciais
   */
  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      
      // Buscar moeda preferida (com fallback silencioso)
      let preferredCurrency = 'BRL';
      try {
        preferredCurrency = await userService.getPreferredCurrency();
      } catch (error) {
        // Se falhar, usar BRL como padrão sem mostrar erro
        console.warn('Usando moeda padrão BRL');
      }
      setCurrency(preferredCurrency);
      
      // Carregar restaurantes disponíveis
      await loadRestaurants();
      
      // Se estiver editando, carregar dados do produto
      if (isEditMode && planId) {
        const numericId = parseInt(planId);
        if (!isNaN(numericId)) {
          await loadProductData(numericId, preferredCurrency);
        }
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Carregar dados do produto para edição
   */
  const loadProductData = async (productId, targetCurrency) => {
    try {
      console.log(`📦 Carregando produto ${productId} para edição...`);
      const product = await planService.getPlanById(productId, targetCurrency);
      console.log('✅ Produto carregado para edição:', product);
      
      setTitle(product.name || '');
      setDescription(product.description || '');
      
      // Usar price original (não convertedPrice) para edição
      setPrice(String(product.price || product.convertedPrice || ''));
      setCurrency(product.currency || 'BRL');
      setImageUrl(product.imageUrl || '');
      setImagePreview(product.imageUrl || null); // Preview da imagem ao editar
      
      // Carregar restaurantes associados
      if (product.restaurants && product.restaurants.length > 0) {
        const restaurantNames = product.restaurants.map(r => r.name || r);
        console.log('🍽️ Restaurantes carregados:', restaurantNames);
        setRestaurants(restaurantNames);
      } else {
        console.log('⚠️ Nenhum restaurante associado ao produto');
        setRestaurants([]);
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar produto para edição:', error);
      Alert.alert(
        'Erro',
        `Não foi possível carregar os dados do produto ID: ${productId}. Verifique se o produto existe no backend.`,
        [
          { text: 'OK' },
          {
            text: 'Voltar',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  /**
   * Carregar restaurantes disponíveis
   */
  const loadRestaurants = async () => {
    try {
      const restaurantsList = await restaurantService.getAllRestaurants();
      setAvailableRestaurants(restaurantsList || []);
    } catch (error) {
      console.error('Erro ao carregar restaurantes:', error);
      setAvailableRestaurants([]);
    }
  };

  /**
   * Criar novo restaurante e adicionar à lista
   */
  const handleAddRestaurant = async () => {
    if (!newRestaurant.trim()) {
      return;
    }

    try {
      setLoading(true);
      
      // Criar restaurante no backend
      const createdRestaurant = await restaurantService.createRestaurant({
        name: newRestaurant.trim(),
      });
      
      // Adicionar à lista de restaurantes disponíveis
      setAvailableRestaurants([...availableRestaurants, createdRestaurant]);
      
      // Adicionar à lista de restaurantes do plano
      setRestaurants([...restaurants, createdRestaurant.name || newRestaurant.trim()]);
      
      setNewRestaurant('');
      setShowAddRestaurant(false);
      
      Alert.alert('Sucesso', 'Restaurante criado e adicionado ao plano!');
      
    } catch (error) {
      console.error('Erro ao criar restaurante:', error);
      Alert.alert('Erro', error.message || 'Não foi possível criar o restaurante.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRestaurant = (index) => {
    setRestaurants(restaurants.filter((_, i) => i !== index));
  };

  /**
   * Selecionar e fazer upload de imagem
   */
  const handleSelectImage = async () => {
    try {
      setUploadingImage(true);

      // Mostrar opções: Galeria ou Câmera
      Alert.alert(
        'Selecionar Imagem',
        'Escolha a origem da imagem',
        [
          {
            text: 'Galeria',
            onPress: async () => {
              try {
                const url = await cloudinaryService.selectAndUpload('gallery', 'saborize/planos');
                if (url) {
                  setImageUrl(url);
                  setImagePreview(url);
                  Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
                }
              } catch (error) {
                Alert.alert('Erro', `Erro ao fazer upload: ${error.message}`);
              } finally {
                setUploadingImage(false);
              }
            },
          },
          {
            text: 'Câmera',
            onPress: async () => {
              try {
                const url = await cloudinaryService.selectAndUpload('camera', 'saborize/planos');
                if (url) {
                  setImageUrl(url);
                  setImagePreview(url);
                  Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
                }
              } catch (error) {
                Alert.alert('Erro', `Erro ao fazer upload: ${error.message}`);
              } finally {
                setUploadingImage(false);
              }
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => setUploadingImage(false),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', `Erro ao selecionar imagem: ${error.message}`);
      setUploadingImage(false);
    }
  };

  /**
   * Remover imagem selecionada
   */
  const handleRemoveImage = () => {
    Alert.alert(
      'Remover Imagem',
      'Deseja remover a imagem selecionada?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setImageUrl('');
            setImagePreview(null);
          },
        },
      ]
    );
  };

  /**
   * Salvar/Criar produto
   */
  const handleAddPlan = async () => {
    // Validações
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, digite o título do plano.');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Erro', 'Por favor, digite a descrição do plano.');
      return;
    }
    
    if (description.length > 100) {
      Alert.alert('Erro', 'A descrição deve ter no máximo 100 caracteres.');
      return;
    }
    
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Erro', 'Por favor, digite um preço válido maior que zero.');
      return;
    }
    
    try {
      setLoading(true);
      
      const productData = {
        name: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        currency: currency,
        imageUrl: imageUrl || '', // Incluir URL da imagem do Cloudinary
      };
      
      let savedProduct;
      
      if (isEditMode && planId) {
        // Atualizar produto existente
        const numericId = parseInt(planId);
        if (!isNaN(numericId)) {
          savedProduct = await planService.updatePlan(numericId, productData);
          
          // Associar restaurantes ao plano
          await associateRestaurantsToPlan(savedProduct.id || numericId);
          
          Alert.alert('Sucesso', 'Produto atualizado com sucesso!', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        } else {
          Alert.alert('Erro', 'ID do produto inválido.');
        }
      } else {
        // Criar novo produto
        savedProduct = await planService.createProduct(productData);
        
        // Associar restaurantes ao plano (apenas se houver restaurantes)
        if (savedProduct.id && restaurants.length > 0) {
          await associateRestaurantsToPlan(savedProduct.id);
        }
        
        Alert.alert('Sucesso', 'Produto criado com sucesso!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
      
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível salvar o produto. Verifique se você tem permissão de administrador.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Associar restaurantes ao plano
   */
  const associateRestaurantsToPlan = async (planId) => {
    try {
      // Para cada restaurante na lista, associar ao plano
      for (const restaurantName of restaurants) {
        // Encontrar o restaurante pelo nome
        const restaurant = availableRestaurants.find(r => 
          (r.name || '').toLowerCase() === restaurantName.toLowerCase()
        );
        
        if (restaurant && restaurant.id) {
          try {
            await restaurantService.associateWithPlan(planId, restaurant.id);
          } catch (error) {
            console.warn(`Erro ao associar restaurante ${restaurantName}:`, error);
            // Continuar com os outros restaurantes mesmo se um falhar
          }
        }
      }
    } catch (error) {
      console.error('Erro ao associar restaurantes:', error);
      // Não bloquear o salvamento do produto se a associação falhar
    }
  };

  // Se não for admin, não renderizar nada
  if (!isAdmin) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleNavigation('back')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#792F14" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Editar plano' : 'Cadastro de novo plano'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Seção de Upload de Imagem */}
          <View style={styles.imageUploadContainer}>
            {imagePreview ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: imagePreview }} 
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={handleRemoveImage}
                >
                  <MaterialIcons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={handleSelectImage}
                  disabled={uploadingImage}
                >
                  <MaterialIcons name="edit" size={20} color="#792F14" />
                  <Text style={styles.changeImageText}>Alterar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.imageUploadButton} 
                activeOpacity={0.7}
                onPress={handleSelectImage}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <>
                    <MaterialIcons name="hourglass-empty" size={48} color="#792F14" />
                    <Text style={styles.imageUploadText}>Enviando imagem...</Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons name="add-photo-alternate" size={48} color="#792F14" />
                    <Text style={styles.imageUploadText}>Adicione uma imagem</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Campo Título */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o título do plano"
              placeholderTextColor="#B8A99A"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="words"
            />
          </View>

          {/* Campo Descrição */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Descreva o plano"
                placeholderTextColor="#B8A99A"
                value={description}
                onChangeText={(text) => {
                  if (text.length <= MAX_DESCRIPTION_LENGTH) {
                    setDescription(text);
                  }
                }}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <Text style={styles.charCounter}>
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </Text>
            </View>
          </View>

          {/* Campo Preço */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preço</Text>
            <View style={styles.priceContainer}>
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder="0.00"
                placeholderTextColor="#B8A99A"
                value={price}
                onChangeText={(text) => {
                  // Permitir apenas números e ponto decimal
                  const cleaned = text.replace(/[^0-9.]/g, '');
                  // Garantir apenas um ponto decimal
                  const parts = cleaned.split('.');
                  if (parts.length > 2) {
                    setPrice(parts[0] + '.' + parts.slice(1).join(''));
                  } else {
                    setPrice(cleaned);
                  }
                }}
                keyboardType="decimal-pad"
              />
              <View style={styles.currencySelector}>
                <TouchableOpacity
                  style={[styles.currencyButton, currency === 'BRL' && styles.currencyButtonActive]}
                  onPress={() => setCurrency('BRL')}
                >
                  <Text style={[styles.currencyText, currency === 'BRL' && styles.currencyTextActive]}>BRL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.currencyButton, currency === 'USD' && styles.currencyButtonActive]}
                  onPress={() => setCurrency('USD')}
                >
                  <Text style={[styles.currencyText, currency === 'USD' && styles.currencyTextActive]}>USD</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.currencyButton, currency === 'EUR' && styles.currencyButtonActive]}
                  onPress={() => setCurrency('EUR')}
                >
                  <Text style={[styles.currencyText, currency === 'EUR' && styles.currencyTextActive]}>EUR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Campo Onde aceita */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Onde aceita</Text>
            
            {/* Lista de Restaurantes Adicionados */}
            {restaurants.length > 0 && (
              <View style={styles.restaurantsList}>
                {restaurants.map((restaurant, index) => (
                  <View key={index} style={styles.restaurantItem}>
                    <Text style={styles.restaurantName}>{restaurant}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveRestaurant(index)}
                      style={styles.removeButton}
                    >
                      <MaterialIcons name="close" size={20} color="#E07A5F" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Input para adicionar restaurante */}
            {showAddRestaurant ? (
              <View style={styles.addRestaurantContainer}>
                <TextInput
                  style={styles.restaurantInput}
                  placeholder="Digite o nome do restaurante"
                  placeholderTextColor="#B8A99A"
                  value={newRestaurant}
                  onChangeText={setNewRestaurant}
                  autoCapitalize="words"
                  onSubmitEditing={handleAddRestaurant}
                />
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={handleAddRestaurant}
                >
                  <MaterialIcons name="check" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddRestaurant(false);
                    setNewRestaurant('');
                  }}
                >
                  <MaterialIcons name="close" size={20} color="#792F14" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addRestaurantButton}
                onPress={() => setShowAddRestaurant(true)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="add" size={24} color="#792F14" />
                <Text style={styles.addRestaurantText}>Adicione um restaurante</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Espaço para o botão fixo */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Botão Adicionar Plano (fixo na parte inferior) */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.addPlanButton,
              (!title || !description || !price) && styles.addPlanButtonDisabled
            ]}
            onPress={handleAddPlan}
            disabled={!title || !description || !price || loading}
            activeOpacity={0.8}
          >
            <Text style={styles.addPlanButtonText}>
              {isEditMode ? 'Salvar alterações' : 'Adicionar plano'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barra de Navegação Inferior - Removida para admin */}

        {/* Loading Overlay */}
        <LoadingOverlay visible={loading || loadingData} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEDC3',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FAEDC3',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  imageUploadContainer: {
    marginBottom: 24,
  },
  imageUploadButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFF7DD',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#792F14',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadText: {
    fontSize: 16,
    color: '#792F14',
    marginTop: 12,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF7DD',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FFF7DD',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  changeImageText: {
    fontSize: 14,
    color: '#792F14',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#792F14',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#792F14',
    borderWidth: 1,
    borderColor: '#FAEDC3',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FAEDC3',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    position: 'relative',
    minHeight: 120,
  },
  textArea: {
    fontSize: 16,
    color: '#792F14',
    minHeight: 100,
  },
  charCounter: {
    fontSize: 12,
    color: '#792F14',
    textAlign: 'right',
    marginTop: 4,
  },
  restaurantsList: {
    marginBottom: 12,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FAEDC3',
  },
  restaurantName: {
    flex: 1,
    fontSize: 15,
    color: '#792F14',
  },
  removeButton: {
    padding: 4,
  },
  addRestaurantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FAEDC3',
  },
  addRestaurantText: {
    fontSize: 16,
    color: '#792F14',
    marginLeft: 8,
    fontWeight: '500',
  },
  addRestaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  restaurantInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#792F14',
    borderWidth: 1,
    borderColor: '#FAEDC3',
  },
  confirmButton: {
    backgroundColor: '#792F14',
    borderRadius: 8,
    padding: 10,
  },
  cancelButton: {
    backgroundColor: '#FAEDC3',
    borderRadius: 8,
    padding: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  currencySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FAEDC3',
    backgroundColor: '#FFFFFF',
  },
  currencyButtonActive: {
    backgroundColor: '#792F14',
    borderColor: '#792F14',
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#792F14',
  },
  currencyTextActive: {
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 150,
  },
  footer: {
    backgroundColor: '#FAEDC3',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: '#FAEDC3',
  },
  addPlanButton: {
    backgroundColor: '#792F14',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPlanButtonDisabled: {
    backgroundColor: '#B8A99A',
    opacity: 0.6,
  },
  addPlanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

