import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CouponsScreen() {
  const availableCoupons = [
    { id: 1, name: 'Cupom Fast Food', discount: '30%' },
    { id: 2, name: 'Cupom Fast Food', discount: '30%' },
    { id: 3, name: 'Cupom Fast Food', discount: '30%' },
    { id: 4, name: 'Cupom Fast Food', discount: '30%' },
  ];

  const usedCoupons = [
    { id: 5, name: 'Cupom Fast Food', discount: '30%' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7A4F3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Cupons</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção Cupons Disponíveis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cupons Disponíveis</Text>
          
          {availableCoupons.map((coupon) => (
            <TouchableOpacity key={coupon.id} style={styles.couponCard}>
              <Text style={styles.couponName}>{coupon.name}</Text>
              <Text style={styles.couponDiscount}>{coupon.discount}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.validityText}>Validade: 00/00/0000</Text>
        </View>

        {/* Seção Cupons Utilizados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cupons Utilizados</Text>
          
          {usedCoupons.map((coupon) => (
            <TouchableOpacity key={coupon.id} style={styles.couponCard}>
              <Text style={styles.couponName}>{coupon.name}</Text>
              <Text style={styles.couponDiscount}>{coupon.discount}</Text>
            </TouchableOpacity>
          ))}
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
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeNavItem}>
            <MaterialIcons name="local-offer" size={28} color="#E07A5F" />
          </View>
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7A4F3B',
    marginBottom: 16,
  },
  couponCard: {
    backgroundColor: '#EADDCB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  couponName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A4F3B',
  },
  couponDiscount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7A4F3B',
  },
  validityText: {
    fontSize: 12,
    color: '#9D7A6B',
    textAlign: 'right',
    marginTop: 8,
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
    backgroundColor: '#EADDCB',
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

