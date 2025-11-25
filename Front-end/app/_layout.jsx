import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';

// mantem a splash scren ate tudo carregar
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // retira slpash screen quando tudo carregar
    const hideSplashScreen = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Erro ao ocultar splash screen:', e);
      }
    };

    // delay p tudo carregar (aumentado para garantir que a splash apareça)
    const timer = setTimeout(() => {
      hideSplashScreen();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <CurrencyProvider>
        <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FAEDC3' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="coupons" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="search" />
        <Stack.Screen name="order-success" />
        <Stack.Screen name="plan-details" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="add-plan" />
        </Stack>
        <StatusBar style="dark" backgroundColor="#FAEDC3" />
      </CurrencyProvider>
    </AuthProvider>
  );
}

