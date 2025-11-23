import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderSuccessScreen() {
  useEffect(() => {
    // Redireciona para home após 5 segundos
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 5000);

    // Limpa o timer se o componente for desmontado
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Ícone de Sucesso */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="check-circle" size={100} color="#4CAF50" />
        </View>

        {/* Mensagem */}
        <Text style={styles.successTitle}>Pedido finalizado com sucesso!</Text>
        <Text style={styles.successMessage}>
          Seu pedido foi processado e em breve você receberá mais informações.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F0E3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7A4F3B',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#9D7A6B',
    textAlign: 'center',
    lineHeight: 24,
  },
});

