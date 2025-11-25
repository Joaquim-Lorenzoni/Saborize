import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import userService from '../services/user.service';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [fontSize, setFontSize] = useState('SMALL');
  const [currencyDisplay, setCurrencyDisplay] = useState('Real');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  
  const { logout, isAdmin, isAuthenticated } = useAuth();
  const { preferredCurrency, updatePreferredCurrency } = useCurrency();

  const currencies = [
    { code: 'BRL', name: 'Real (BRL)' },
    { code: 'USD', name: 'Dólar (USD)' },
    { code: 'EUR', name: 'Euro (EUR)' },
  ];

  /**
   * Carregar dados do usuário ao montar
   */
  useEffect(() => {
    // Só carregar dados se estiver autenticado
    if (isAuthenticated) {
      loadUserData();
    } else {
      setLoadingData(false);
    }
  }, [isAuthenticated]);

  /**
   * Atualizar display da moeda quando preferredCurrency mudar
   */
  useEffect(() => {
    const currencyOption = currencies.find(c => c.code === preferredCurrency);
    setCurrencyDisplay(currencyOption?.name || 'Real (BRL)');
  }, [preferredCurrency]);

  /**
   * Carregar dados do usuário
   */
  const loadUserData = async () => {
    // Não carregar se não estiver autenticado
    if (!isAuthenticated) {
      setLoadingData(false);
      return;
    }

    try {
      setLoadingData(true);
      
      const userData = await userService.getCurrentUser();
      
      setUserName(userData.name || '');
      setUserEmail(userData.email || '');
      setNotificationsEnabled(userData.notificationsEnabled ?? true);
      setDarkModeEnabled(userData.darkModeEnabled ?? false);
      setFontSize(userData.fontSize || 'SMALL');
      
      // Atualizar display da moeda baseado no contexto
      const currencyOption = currencies.find(c => c.code === preferredCurrency);
      setCurrencyDisplay(currencyOption?.name || 'Real (BRL)');
      
    } catch (error) {
      // Não mostrar erro se for 401 (não autenticado)
      if (error.status === 401) {
        console.warn('Usuário não autenticado, redirecionando...');
        router.replace('/');
        return;
      }
      console.error('Erro ao carregar dados do usuário:', error);
      // Não mostrar alerta para não incomodar o usuário
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Salvar preferências
   */
  const savePreferences = async () => {
    try {
      setLoading(true);
      
      await userService.updatePreferences({
        notificationsEnabled,
        darkModeEnabled,
        fontSize: fontSize.toUpperCase(),
        preferredCurrency: preferredCurrency,
      });
      
      Alert.alert(
        'Sucesso',
        'Preferências salvas com sucesso!',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      Alert.alert('Erro', 'Não foi possível salvar as preferências.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualizar preferência e salvar automaticamente
   */
  const updatePreference = async (key, value) => {
    if (key === 'notificationsEnabled') {
      setNotificationsEnabled(value);
    } else if (key === 'darkModeEnabled') {
      setDarkModeEnabled(value);
    } else if (key === 'fontSize') {
      setFontSize(value);
    } else if (key === 'currency') {
      // Atualizar moeda no contexto (isso vai notificar todas as telas)
      await updatePreferredCurrency(value);
      const currencyOption = currencies.find(c => c.code === value);
      setCurrencyDisplay(currencyOption?.name || 'Real (BRL)');
      setShowCurrencyModal(false);
      // Salvar preferências
      await savePreferences();
      return; // Não continuar para evitar duplicar savePreferences
    }
    
    // Salvar após um pequeno delay para evitar muitas requisições
    setTimeout(() => {
      savePreferences();
    }, 500);
  };

  /**
   * Fazer logout
   */
  const handleLogout = async () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await logout();
              router.replace('/');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível fazer logout.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleNavigation('back')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#792F14" />
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
          <Text style={styles.userName}>{userName || 'Usuário'}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Exemplo@exemplo.com.br"
              placeholderTextColor="#8B6F47"
              value={userEmail}
              editable={false}
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
              onValueChange={(value) => updatePreference('notificationsEnabled', value)}
              trackColor={{ false: '#D4C4B8', true: '#792F14' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D4C4B8"
            />
          </View>

          {/* Modo Escuro */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Modo escuro</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={(value) => updatePreference('darkModeEnabled', value)}
              trackColor={{ false: '#D4C4B8', true: '#792F14' }}
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
                onPress={() => updatePreference('fontSize', 'SMALL')}
              >
                <View style={styles.radioButton}>
                  {fontSize === 'SMALL' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioLabel}>Pequena</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => updatePreference('fontSize', 'MEDIUM')}
              >
                <View style={styles.radioButton}>
                  {fontSize === 'MEDIUM' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioLabel}>Média</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => updatePreference('fontSize', 'LARGE')}
              >
                <View style={styles.radioButton}>
                  {fontSize === 'LARGE' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioLabel}>Grande</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Moeda */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Moeda</Text>
            <TouchableOpacity 
              style={styles.currencySelector}
              onPress={() => setShowCurrencyModal(true)}
            >
              <Text style={styles.currencyText}>{currencyDisplay}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão Painel Admin (apenas para admins) */}
        {isAdmin && (
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={() => router.push('/admin')}
          >
            <Text style={styles.adminButtonText}>Painel Administrativo</Text>
            <MaterialIcons name="admin-panel-settings" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Botão Sair da Conta */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Sair da Conta</Text>
          <MaterialIcons name="logout" size={20} color="#7A4F3B" />
        </TouchableOpacity>

        {/* Espaço para a barra de navegação */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal de Seleção de Moeda */}
      <Modal
        visible={showCurrencyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Moeda</Text>
            {currencies.map((curr) => (
              <TouchableOpacity
                key={curr.code}
                style={[
                  styles.currencyOption,
                  preferredCurrency === curr.code && styles.currencyOptionSelected,
                ]}
                onPress={() => updatePreference('currency', curr.code)}
              >
                <Text
                  style={[
                    styles.currencyOptionText,
                    preferredCurrency === curr.code && styles.currencyOptionTextSelected,
                  ]}
                >
                  {curr.name}
                </Text>
                {preferredCurrency === curr.code && (
                  <MaterialIcons name="check" size={24} color="#792F14" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCurrencyModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading || loadingData} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEDC3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAEDC3',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D2691E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    fontSize: 70,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#792F14',
    marginBottom: 20,
  },
  inputGroup: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#792F14',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#792F14',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#792F14',
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
    borderColor: '#792F14',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#792F14',
  },
  radioLabel: {
    fontSize: 16,
    color: '#792F14',
  },
  currencySelector: {
    backgroundColor: '#792F14',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutText: {
    fontSize: 16,
    color: '#792F14',
    fontWeight: '600',
  },
  adminButton: {
    backgroundColor: '#792F14',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  adminButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#792F14',
    marginBottom: 20,
    textAlign: 'center',
  },
  currencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FAEDC3',
  },
  currencyOptionSelected: {
    backgroundColor: '#FFF7DD',
    borderWidth: 2,
    borderColor: '#792F14',
  },
  currencyOptionText: {
    fontSize: 16,
    color: '#792F14',
  },
  currencyOptionTextSelected: {
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#792F14',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

