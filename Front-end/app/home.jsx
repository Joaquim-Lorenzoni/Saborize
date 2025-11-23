import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import LoadingOverlay from '../components/LoadingOverlay';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path, params = {}) => {
    setLoading(true);
    setTimeout(() => {
      router.push({ pathname: path, params });
      setLoading(false);
    }, 200);
  };

  return (
    <View style={styles.container}>
      {/* Topo Amarelo com Header  */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, Nome do Usuário</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => handleNavigation('/profile')}
          >
            <Text style={styles.avatar}>🦝</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Container Branco com Bordas Arredondadas */}
      <ScrollView 
        style={styles.whiteContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* Banner Promocional */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../assets/images/BANNER P.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Seção de Categorias */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Planos especiais para você</Text>
          <View style={styles.sectionHeader}>
            <TouchableOpacity 
              style={styles.seeMoreButton}
              onPress={() => handleNavigation('/search')}
            >
              <Text style={styles.seeMoreLink}>Ver Mais</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesGrid}>
            {/* Fast Food */}
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleNavigation('/plan-details', { planId: 'fast-food' })}
            >
              <View style={styles.categoryImageContainer}>
                <Image 
                  source={require('../assets/images/FAST FOOD.png')}
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.categoryNameContainer}>
                <Text style={styles.categoryName}>Fast Food</Text>
              </View>
            </TouchableOpacity>

            {/* Saudável */}
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleNavigation('/plan-details', { planId: 'saudavel' })}
            >
              <View style={styles.categoryImageContainer}>
                <Image 
                  source={require('../assets/images/SAUDAVEL.png')}
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.categoryNameContainer}>
                <Text style={styles.categoryName}>Saudável</Text>
              </View>
            </TouchableOpacity>

            {/* Tortaria */}
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleNavigation('/plan-details', { planId: 'tortaria' })}
            >
              <View style={styles.categoryImageContainer}>
                <Image 
                  source={require('../assets/images/TORTA.png')}
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.categoryNameContainer}>
                <Text style={styles.categoryName}>Tortaria</Text>
              </View>
            </TouchableOpacity>

            {/* Italiana */}
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleNavigation('/plan-details', { planId: 'italiana' })}
            >
              <View style={styles.categoryImageContainer}>
                <Image 
                  source={require('../assets/images/ITALIANO.png')}
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.categoryNameContainer}>
                <Text style={styles.categoryName}>Italiana</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Barra de Navegação Inferior */}
      <BottomNavBar activeRoute="home" />

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} />
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
    paddingBottom: 100,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#792F14',
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
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
  avatar: {
    fontSize: 35,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  bannerImage: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: -10,
  },
  sectionHeader: {
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  seeMoreButton: {
    alignSelf: 'flex-end',
  },
  seeMoreLink: {
    fontSize: 14,
    color: '#D5924D',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#FFF7DD',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryImageContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  categoryImage: {
    width: 70,
    height: 70,
  },
  categoryNameContainer: {
    backgroundColor: '#FAEDC3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0E0C0',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#792F14',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 130,
  },
});

