import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { register } = useAuth();

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

  /**
   * Função de registro com API
   */
  const handleRegister = async () => {
    // Limpar erro anterior
    setError('');
    
    // Validações básicas
    if (!name.trim()) {
      setError('Por favor, digite seu nome completo');
      return;
    }
    
    if (!email.trim()) {
      setError('Por favor, digite seu email');
      return;
    }
    
    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, digite um email válido');
      return;
    }
    
    if (!password.trim()) {
      setError('Por favor, digite sua senha');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    try {
      setLoading(true);
      
      // Chamar API de registro
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      // Sucesso - navegar para home
      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/home'),
          },
        ]
      );
      
    } catch (err) {
      console.error('Erro no registro:', err);
      
      // Exibir mensagem de erro
      const errorMessage = err.message || 'Erro ao criar conta. Tente novamente.';
      setError(errorMessage);
      
      Alert.alert(
        'Erro no Cadastro',
        errorMessage,
        [{ text: 'OK' }]
      );
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Botão Voltar */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => handleNavigation('back')}
        >
          <MaterialIcons name="arrow-back" size={24} color="#792F14" />
        </TouchableOpacity>

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
          <Text style={styles.welcomeText}>Crie sua conta</Text>
        </View>

        {/* Campos de Entrada */}
        <View style={styles.formContainer}>
          {/* Mensagem de erro */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite aqui o seu nome completo"
              placeholderTextColor="#792F14"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite aqui o seu e-mail"
              placeholderTextColor="#792F14"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite aqui a sua senha (mín. 6 caracteres)"
              placeholderTextColor="#792F14"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite novamente a sua senha"
              placeholderTextColor="#792F14"
              secureTextEntry
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Link de Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={() => handleNavigation('back')}>
            <Text style={styles.loginLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEDC3',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoTicket: {
    width: 140,
    height: 140,
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
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
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
  registerButton: {
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
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 20,
    gap: 4,
  },
  loginText: {
    fontSize: 16,
    color: '#792F14',
    textAlign: 'center',
  },
  loginLink: {
    fontSize: 16,
    color: '#792F14',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#c62828',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '500',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
});

