import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';
import LoadingOverlay from '../components/LoadingOverlay';

export default function CouponsScreen() {
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
  const availableCoupons = [
    { id: 1, name: 'Plano Fast Food', validity: '00/00/0000' },
  ];

  const usedCoupons = [
    { id: 5, name: 'Cupom Fast Food', discount: '30%' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleNavigation('back')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#792F14" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas assinaturas</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção Planos Disponíveis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planos Disponíveis</Text>
          
          {availableCoupons.map((coupon) => (
            <View key={coupon.id} style={styles.couponWrapper}>
              <TouchableOpacity style={styles.couponCard}>
                <Text style={styles.couponName}>{coupon.name}</Text>
                <MaterialIcons name="chevron-right" size={24} color="#792F14" />
              </TouchableOpacity>
              <Text style={styles.validityText}>Validade: {coupon.validity}</Text>
            </View>
          ))}
        </View>

        {/* Seção Cupons Utilizados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cupons Utilizados</Text>
          
          {usedCoupons.map((coupon) => (
            <View key={coupon.id} style={styles.couponWrapper}>
              <TouchableOpacity style={styles.couponCard}>
                <Text style={styles.couponName}>{coupon.name}</Text>
                <Text style={styles.couponDiscount}>{coupon.discount}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Barra de Navegação Inferior */}
      <BottomNavBar activeRoute="coupons" />

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
    paddingBottom: 40,
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#792F14',
    marginBottom: 16,
  },
  couponWrapper: {
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
  couponCard: {
    backgroundColor: '#FFF7DD',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#792F14',
  },
  couponDiscount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#792F14',
  },
  validityText: {
    fontSize: 11,
    color: '#8B6F47',
    textAlign: 'right',
    marginTop: 8,
  },
  bottomSpacer: {
    height: 130,
  },
});

