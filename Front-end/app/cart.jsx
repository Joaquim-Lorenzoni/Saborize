import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  // Dados mockados do carrinho
  const cartItems = [
    {
      id: 1,
      name: 'Plano Fast Food',
      description: 'A opção ideal pra quem busca uma refeição...',
      price: 30.00,
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7A4F3B" />
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
            <Text style={styles.itemsCount}>Items: {totalItems}</Text>
          </View>

          {/* Lista de Itens do Carrinho */}
          {cartItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
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
          ))}

          {/* Link Remover Item */}
          <TouchableOpacity style={styles.removeItemButton}>
            <Text style={styles.removeItemText}>Remover item</Text>
          </TouchableOpacity>
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
            onPress={() => router.push('/order-success')}
          >
            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>

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
          <MaterialIcons name="search" size={28} color="#9D7A6B" />
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
            <MaterialIcons name="shopping-cart" size={28} color="#E07A5F" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7A4F3B',
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
    paddingBottom: 40,
  },
  bagSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bagTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7A4F3B',
  },
  itemsCount: {
    fontSize: 14,
    color: '#9D7A6B',
  },
  itemCard: {
    backgroundColor: '#EADDCB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemImage: {
    fontSize: 40,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7A4F3B',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#9D7A6B',
    marginBottom: 8,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A4F3B',
  },
  removeItemButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  removeItemText: {
    fontSize: 14,
    color: '#A0522D',
    fontWeight: '500',
  },
  summarySection: {
    backgroundColor: '#EADDCB',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
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
    fontSize: 16,
    color: '#7A4F3B',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#7A4F3B',
    fontWeight: '600',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7A4F3B',
  },
  checkoutButton: {
    backgroundColor: '#7A4F3B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 80,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    borderTopWidth: 1,
    borderTopColor: '#EADDCB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
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
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

