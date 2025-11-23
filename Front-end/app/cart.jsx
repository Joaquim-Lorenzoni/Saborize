import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../components/LoadingOverlay';

export default function CartScreen() {
  const [loading, setLoading] = useState(false);

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

  // Dados mockados do carrinho (precisa de alteração ainda)
  const cartItems = [
    {
      id: 1,
      name: 'Plano Fast Food',
      description: 'Disponível 24 horas, diversas variedades.',
      price: 10.00,
      image: '🍔',
      quantity: 1,
    },
  ];

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
          {cartItems.map((item) => (
            <View key={item.id} style={styles.itemWrapper}>
              <View style={styles.itemCard}>
                {/* Imagem do Produto */}
                <View style={styles.itemImageContainer}>
                  <Text style={styles.itemImage}>{item.image}</Text>
                </View>

                {/* Informações do Produto */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={styles.itemPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </View>
              
              {/* Link Remover Item */}
              <TouchableOpacity style={styles.removeItemButton}>
                <Text style={styles.removeItemText}>Remover Item</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Seção de Resumo */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Quantidade</Text>
            <Text style={styles.summaryValue}>{totalItems} item</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryTotal}>R$ {totalPrice.toFixed(2).replace('.', ',')}</Text>
          </View>

          {/* Botão Finalizar Compra */}
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => handleNavigation('/order-success')}
          >
            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

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
});

