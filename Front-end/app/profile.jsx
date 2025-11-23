import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [fontSize, setFontSize] = useState('small'); // 'small' or 'large'
  const [currency, setCurrency] = useState('Real');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7A4F3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção de Perfil */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>🦝</Text>
          </View>
          <Text style={styles.userName}>Nome do Usuário</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Exemplo@exemplo.com.br"
              placeholderTextColor="#9D7A6B"
              value="Exemplo@exemplo.com.br"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Seção de Configurações */}
        <View style={styles.settingsSection}>
          {/* Notificações */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notificações</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D4C4B8', true: '#7A4F3B' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D4C4B8"
            />
          </View>

          {/* Modo Escuro */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Modo escuro</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#D4C4B8', true: '#7A4F3B' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D4C4B8"
            />
          </View>

          {/* Tamanho da Fonte */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Tamanho da Fonte</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setFontSize('small')}
              >
                <View style={styles.radioButton}>
                  {fontSize === 'small' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioLabel}>Pequena</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setFontSize('large')}
              >
                <View style={styles.radioButton}>
                  {fontSize === 'large' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioLabel}>Grande</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Moeda */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Moeda</Text>
            <TouchableOpacity style={styles.currencySelector}>
              <Text style={styles.currencyText}>{currency}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão Sair da Conta */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.logoutText}>Sair da Conta</Text>
          <MaterialIcons name="logout" size={20} color="#7A4F3B" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F0E3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F0E3',
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
  profileSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E07A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatar: {
    fontSize: 60,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7A4F3B',
    marginBottom: 20,
  },
  inputGroup: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#9D7A6B',
    marginBottom: 8,
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
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  settingItem: {
    backgroundColor: '#EADDCB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#7A4F3B',
    fontWeight: '500',
    marginBottom: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7A4F3B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7A4F3B',
  },
  radioLabel: {
    fontSize: 16,
    color: '#7A4F3B',
  },
  currencySelector: {
    backgroundColor: '#7A4F3B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  currencyText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EADDCB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#7A4F3B',
    fontWeight: '600',
  },
});

