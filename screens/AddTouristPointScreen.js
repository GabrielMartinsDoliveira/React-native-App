import React, { useEffect, useState } from 'react';
import { View, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/styles';

const API_URL = 'http://192.168.0.8:3000';

export default function AddTouristPointScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  // Solicita permissão e pega localização
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } else {
        Alert.alert('Permissão de localização negada');
      }
    })();
  }, []);

  // Abrir câmera
  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão para acessar a câmera foi negada!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0]);
    }
  };

  // Enviar para backend
 const handleSubmit = async () => {
  if (!name || !description) {
    Alert.alert('Preencha todos os campos obrigatórios.');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);

  if (image) {
    formData.append('photo', {
      uri: image.uri,
      name: `photo-${Date.now()}.jpg`,
      type: 'image/jpeg',
    });
  }

  if (location) {
    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());
  }

  try {
    console.log('Enviando dados...', {
      name,
      description,
      hasImage: !!image,
      location
    });

    const response = await fetch(`${API_URL}/TouristPoints`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        // Não defina Content-Type - será definido automaticamente com boundary
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao salvar ponto turístico');
    }

    Alert.alert('Sucesso', 'Ponto turístico salvo com sucesso!');
    navigation.goBack();
  } catch (error) {
    console.error('Erro detalhado:', error);
    Alert.alert(
      'Erro ao salvar ponto turístico', 
      error.message || 'Erro desconhecido. Verifique sua conexão.'
    );
  }
};

  return (
    <View style={styles.container}>
      <TextInput
        label="Nome do ponto turístico"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
      />
      <Button
        mode="outlined"
        onPress={pickImage}
        style={styles.input}
        icon="camera"
      >
        Tirar Foto
      </Button>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: '100%', height: 200, marginBottom: 10, borderRadius: 8 }}
        />
      )}

      <Button mode="contained" onPress={handleSubmit}>
        Salvar
      </Button>
    </View>
  );
}
