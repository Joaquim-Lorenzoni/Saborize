import { router } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      router.push(path);
      setLoading(false);
    }, 200);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Logo e Título */}
      <View style={styles.logoContainer}>
        <View style={styles.logoTicket}>
          <Image 
            source={require('../assets/images/LOGO.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appTitle}>SABORIZE</Text>
        <Text style={styles.welcomeText}>Seja bem-vindo(a)!</Text>
      </View>

      {/* Campos de Entrada */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui o seu usuário"
            placeholderTextColor="#792F14"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui a sua senha"
            placeholderTextColor="#792F14"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Botão Entrar */}
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => handleNavigation('/home')}
        >
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      {/* Link de Cadastro */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Não possui uma conta?</Text>
        <TouchableOpacity onPress={() => handleNavigation('/register')}>
          <Text style={styles.registerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEDC3',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoTicket: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#792F14',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    color: '#792F14',
    marginTop: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#792F14',
    marginBottom: 8,
    marginLeft: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FAEDC3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#792F14',
    borderWidth: 1.5,
    borderColor: '#792F14',
  },
  loginButton: {
    backgroundColor: '#792F14',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  registerText: {
    fontSize: 16,
    color: '#792F14',
    textAlign: 'center',
  },
  registerLink: {
    fontSize: 16,
    color: '#792F14',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
