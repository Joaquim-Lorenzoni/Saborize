import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
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
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#7A4F3B" />
        </TouchableOpacity>

        {/* Logo e Título */}
        <View style={styles.logoContainer}>
          <View style={styles.logoTicket}>
            <View style={styles.forkContainer}>
              <View style={styles.forkHandle} />
              <View style={styles.forkProngs}>
                <View style={styles.forkProng} />
                <View style={styles.forkProng} />
                <View style={styles.forkProng} />
                <View style={styles.forkProng} />
              </View>
            </View>
            <View style={styles.ticketLine}>
              <View style={styles.dash} />
              <View style={styles.dash} />
              <View style={styles.dash} />
              <View style={styles.dash} />
              <View style={styles.dash} />
              <View style={styles.dash} />
              <View style={styles.dash} />
              <View style={styles.dash} />
              <View style={styles.dash} />
            </View>
          </View>
          <Text style={styles.appTitle}>SABORIZE</Text>
          <Text style={styles.welcomeText}>Crie sua conta</Text>
        </View>

        {/* Campos de Entrada */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite aqui o seu nome completo"
              placeholderTextColor="#B8A99A"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite aqui o seu e-mail"
              placeholderTextColor="#B8A99A"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite aqui o seu usuário"
              placeholderTextColor="#B8A99A"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite aqui a sua senha"
              placeholderTextColor="#B8A99A"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite novamente a sua senha"
              placeholderTextColor="#B8A99A"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {/* Link de Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já possui uma conta? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F0E3',
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
    width: 120,
    height: 120,
    backgroundColor: '#7A4F3B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
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
  forkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  forkHandle: {
    width: 5,
    height: 40,
    backgroundColor: '#F8F0E3',
    borderRadius: 2.5,
    marginBottom: 4,
  },
  forkProngs: {
    flexDirection: 'row',
    gap: 5,
  },
  forkProng: {
    width: 4,
    height: 18,
    backgroundColor: '#F8F0E3',
    borderRadius: 2,
  },
  ticketLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#7A4F3B',
    paddingHorizontal: 2,
    borderTopWidth: 1,
    borderTopColor: '#F8F0E3',
  },
  dash: {
    width: 8,
    height: 2,
    backgroundColor: '#F8F0E3',
    borderRadius: 1,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7A4F3B',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#7A4F3B',
    marginTop: 8,
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
    color: '#7A4F3B',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#EADDCB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#7A4F3B',
    borderWidth: 1,
    borderColor: '#EADDCB',
  },
  registerButton: {
    backgroundColor: '#7A4F3B',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#7A4F3B',
  },
  loginLink: {
    fontSize: 14,
    color: '#7A4F3B',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

