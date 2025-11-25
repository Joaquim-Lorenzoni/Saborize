/**
 * Serviço de Upload para Cloudinary
 * 
 * Gerencia upload de imagens para Cloudinary
 */

import * as ImagePicker from 'expo-image-picker';

// Configurações do Cloudinary
// IMPORTANTE: Estas credenciais devem ser configuradas via variáveis de ambiente em produção
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'seu-cloud-name';
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'seu-upload-preset';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const cloudinaryService = {
  /**
   * Solicitar permissões de acesso à galeria/câmera
   */
  requestPermissions: async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de acesso à galeria negada');
      }
      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      throw error;
    }
  },

  /**
   * Selecionar imagem da galeria
   */
  pickImage: async () => {
    try {
      // Solicitar permissões
      await cloudinaryService.requestPermissions();

      // Abrir seletor de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return null;
      }

      return result.assets[0];
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      throw error;
    }
  },

  /**
   * Tirar foto com a câmera
   */
  takePhoto: async () => {
    try {
      // Solicitar permissões da câmera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de acesso à câmera negada');
      }

      // Abrir câmera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return null;
      }

      return result.assets[0];
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      throw error;
    }
  },

  /**
   * Upload de imagem para Cloudinary
   * 
   * @param {string} imageUri - URI da imagem local
   * @param {string} folder - Pasta no Cloudinary (opcional)
   * @returns {Promise<string>} URL da imagem no Cloudinary
   */
  uploadImage: async (imageUri, folder = 'saborize/planos') => {
    try {
      if (!imageUri) {
        throw new Error('URI da imagem não fornecida');
      }

      // Criar FormData para upload
      const formData = new FormData();
      
      // Extrair nome do arquivo da URI
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      // Adicionar arquivo ao FormData
      formData.append('file', {
        uri: imageUri,
        type: type,
        name: filename || 'image.jpg',
      });

      // Adicionar upload preset (modo unsigned)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      // Adicionar pasta (opcional)
      if (folder) {
        formData.append('folder', folder);
      }

      // Fazer upload
      // Nota: Não definir Content-Type manualmente - React Native faz isso automaticamente com FormData
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro no upload: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Retornar URL segura (HTTPS)
      return data.secure_url || data.url;
    } catch (error) {
      console.error('Erro ao fazer upload para Cloudinary:', error);
      throw error;
    }
  },

  /**
   * Processo completo: selecionar imagem e fazer upload
   * 
   * @param {string} source - 'gallery' ou 'camera'
   * @param {string} folder - Pasta no Cloudinary (opcional)
   * @returns {Promise<string>} URL da imagem no Cloudinary
   */
  selectAndUpload: async (source = 'gallery', folder = 'saborize/planos') => {
    try {
      let imageAsset;

      // Selecionar imagem
      if (source === 'camera') {
        imageAsset = await cloudinaryService.takePhoto();
      } else {
        imageAsset = await cloudinaryService.pickImage();
      }

      if (!imageAsset) {
        return null; // Usuário cancelou
      }

      // Fazer upload
      const imageUrl = await cloudinaryService.uploadImage(imageAsset.uri, folder);
      return imageUrl;
    } catch (error) {
      console.error('Erro no processo de seleção e upload:', error);
      throw error;
    }
  },
};

export default cloudinaryService;

