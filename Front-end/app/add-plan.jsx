import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_DESCRIPTION_LENGTH = 200;

// Dados dos planos para modo de edição
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
  
  const [title, setTitle] = useState(initialTitle || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [restaurants, setRestaurants] = useState([]);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState('');

  // Carregar restaurantes se estiver em modo de edição
  useEffect(() => {
    if (isEditMode && planId && plansData[planId]) {
      setRestaurants(plansData[planId].restaurants);
    }
  }, [isEditMode, planId]);

  const handleAddRestaurant = () => {
    if (newRestaurant.trim()) {
      setRestaurants([...restaurants, newRestaurant.trim()]);
      setNewRestaurant('');
      setShowAddRestaurant(false);
    }
  };

  const handleRemoveRestaurant = (index) => {
    setRestaurants(restaurants.filter((_, i) => i !== index));
  };

  const handleAddPlan = () => {
    // TODO: Implementar lógica de adicionar/editar plano
    if (isEditMode) {
      console.log('Editar plano:', { planId, title, description, restaurants });
    } else {
      console.log('Adicionar plano:', { title, description, restaurants });
    }
    // Por enquanto, apenas volta para a tela anterior
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#7A4F3B" />
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
            <TouchableOpacity style={styles.imageUploadButton} activeOpacity={0.7}>
              <MaterialIcons name="add-photo-alternate" size={48} color="#7A4F3B" />
              <Text style={styles.imageUploadText}>Adicione uma imagem</Text>
            </TouchableOpacity>
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
                      <MaterialIcons name="close" size={20} color="#FF4444" />
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
                  <MaterialIcons name="close" size={20} color="#7A4F3B" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addRestaurantButton}
                onPress={() => setShowAddRestaurant(true)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="add" size={24} color="#7A4F3B" />
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
              (!title || !description || restaurants.length === 0) && styles.addPlanButtonDisabled
            ]}
            onPress={handleAddPlan}
            disabled={!title || !description || restaurants.length === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.addPlanButtonText}>
              {isEditMode ? 'Salvar alterações' : 'Adicionar plano'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F0E3',
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
    borderBottomColor: '#EADDCB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
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
    backgroundColor: '#FFF8F5',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#7A4F3B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadText: {
    fontSize: 16,
    color: '#7A4F3B',
    marginTop: 12,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#7A4F3B',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#7A4F3B',
    borderWidth: 1,
    borderColor: '#EADDCB',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EADDCB',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    position: 'relative',
    minHeight: 120,
  },
  textArea: {
    fontSize: 16,
    color: '#7A4F3B',
    minHeight: 100,
  },
  charCounter: {
    fontSize: 12,
    color: '#9D7A6B',
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
    borderColor: '#EADDCB',
  },
  restaurantName: {
    flex: 1,
    fontSize: 15,
    color: '#7A4F3B',
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
    borderColor: '#EADDCB',
  },
  addRestaurantText: {
    fontSize: 16,
    color: '#7A4F3B',
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
    color: '#7A4F3B',
    borderWidth: 1,
    borderColor: '#EADDCB',
  },
  confirmButton: {
    backgroundColor: '#7A4F3B',
    borderRadius: 8,
    padding: 10,
  },
  cancelButton: {
    backgroundColor: '#EADDCB',
    borderRadius: 8,
    padding: 10,
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    backgroundColor: '#F8F0E3',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: '#EADDCB',
  },
  addPlanButton: {
    backgroundColor: '#7A4F3B',
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

