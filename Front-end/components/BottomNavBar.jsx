import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import cartService from '../services/cart.service';

export default function BottomNavBar({ activeRoute = 'home' }) {
  const [cartCount, setCartCount] = useState(0);

  /**
   * Carregar quantidade de itens no carrinho
   */
  const loadCartCount = useCallback(async () => {
    try {
      const cart = await cartService.getCart();
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error('Erro ao carregar quantidade do carrinho:', error);
      setCartCount(0);
    }
  }, []);

  /**
   * Recarregar quando a tela receber foco
   */
  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [loadCartCount])
  );

  /**
   * Recarregar periodicamente (a cada 1 segundo) para atualizar badge
   */
  useEffect(() => {
    loadCartCount(); // Carregar imediatamente
    const interval = setInterval(() => {
      loadCartCount();
    }, 1000);
    return () => clearInterval(interval);
  }, [loadCartCount]);

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('/home')}
      >
        <MaterialIcons 
          name="home" 
          size={30} 
          color={activeRoute === 'home' ? '#E8B896' : '#C9A882'} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('/search')}
      >
        <MaterialIcons 
          name="search" 
          size={30} 
          color={activeRoute === 'search' ? '#E8B896' : '#C9A882'} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('/coupons')}
      >
        <MaterialIcons 
          name="local-offer" 
          size={30} 
          color={activeRoute === 'coupons' ? '#E8B896' : '#C9A882'} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => {
          loadCartCount(); // Atualizar antes de navegar
          router.push('/cart');
        }}
      >
        <View style={styles.cartContainer}>
          <MaterialIcons 
            name="shopping-cart" 
            size={30} 
            color={activeRoute === 'cart' ? '#E8B896' : '#C9A882'} 
          />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: '15%',
    right: '15%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  cartContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E07A5F',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

