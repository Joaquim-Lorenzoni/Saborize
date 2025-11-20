import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Tela Inicial</Text>
            <Text style={styles.greeting}>Olá, Nome do Usuário</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.avatar}>🦝</Text>
          </TouchableOpacity>
        </View>

        {/* Banner Promocional */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View style={styles.bannerImages}>
              {/* Imagens de comida ao redor */}
              <View style={[styles.foodImage, styles.foodTopLeft]}>
                <Text style={styles.foodEmoji}>☕🍟</Text>
              </View>
              <View style={[styles.foodImage, styles.foodTopCenter]}>
                <Text style={styles.foodEmoji}>🥗</Text>
              </View>
              <View style={[styles.foodImage, styles.foodTopRight]}>
                <Text style={styles.foodEmoji}>🍝</Text>
              </View>
              <View style={[styles.foodImage, styles.foodBottomLeft]}>
                <Text style={styles.foodEmoji}>🍣🥩</Text>
              </View>
              <View style={[styles.foodImage, styles.foodBottomCenter]}>
                <Text style={styles.foodEmoji}>🍦</Text>
              </View>
              <View style={[styles.foodImage, styles.foodBottomRight]}>
                <Text style={styles.foodEmoji}>🍪🍰</Text>
              </View>
            </View>
            <Text style={styles.bannerText}>Mais sabor, menos preço.</Text>
          </View>
        </View>

        {/* Seção de Categorias */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Planos especiais para você</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreLink}>Ver Mais</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesGrid}>
            {/* Fast Food */}
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => router.push({ pathname: '/plan-details', params: { planId: 'fast-food' } })}
            >
              <View style={styles.categoryImageContainer}>
                <Text style={styles.categoryEmoji}>🍔</Text>
              </View>
              <Text style={styles.categoryName}>Fast Food</Text>
            </TouchableOpacity>

            {/* Saudável */}
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => router.push({ pathname: '/plan-details', params: { planId: 'saudavel' } })}
            >
              <View style={styles.categoryImageContainer}>
                <Text style={styles.categoryEmoji}>🥗</Text>
              </View>
              <Text style={styles.categoryName}>Saudável</Text>
            </TouchableOpacity>

            {/* Tortaria */}
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => router.push({ pathname: '/plan-details', params: { planId: 'tortaria' } })}
            >
              <View style={styles.categoryImageContainer}>
                <Text style={styles.categoryEmoji}>🍰</Text>
              </View>
              <Text style={styles.categoryName}>Tortaria</Text>
            </TouchableOpacity>

            {/* Italiana */}
            <TouchableOpacity style={styles.categoryCard}>
              <View style={styles.categoryImageContainer}>
                <Text style={styles.categoryEmoji}>🍝</Text>
              </View>
              <Text style={styles.categoryName}>Italiana</Text>
            </TouchableOpacity>
          </View>
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
          <MaterialIcons name="home" size={28} color="#7A4F3B" />
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
    backgroundColor: '#F8F0E3',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 14,
    color: '#9D7A6B',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7A4F3B',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EADDCB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    fontSize: 30,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  banner: {
    backgroundColor: '#EADDCB',
    borderRadius: 20,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  bannerImages: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  foodImage: {
    position: 'absolute',
  },
  foodTopLeft: {
    top: 10,
    left: 10,
  },
  foodTopCenter: {
    top: 15,
    alignSelf: 'center',
  },
  foodTopRight: {
    top: 10,
    right: 10,
  },
  foodBottomLeft: {
    bottom: 15,
    left: 15,
  },
  foodBottomCenter: {
    bottom: 20,
    alignSelf: 'center',
  },
  foodBottomRight: {
    bottom: 15,
    right: 15,
  },
  foodEmoji: {
    fontSize: 24,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7A4F3B',
    textAlign: 'center',
    zIndex: 1,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7A4F3B',
  },
  seeMoreLink: {
    fontSize: 14,
    color: '#B8A99A',
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#EADDCB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  categoryImageContainer: {
    marginBottom: 10,
  },
  categoryEmoji: {
    fontSize: 50,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A4F3B',
    textAlign: 'center',
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
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

