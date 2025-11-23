import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

// Manter a splash screen visível enquanto o app carrega
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Ocultar a splash screen quando o app estiver pronto
    const hideSplashScreen = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Erro ao ocultar splash screen:', e);
      }
    };

    // Pequeno delay para garantir que tudo carregou
    const timer = setTimeout(() => {
      hideSplashScreen();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="coupons" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="order-success" options={{ headerShown: false }} />
        <Stack.Screen name="plan-details" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="add-plan" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

