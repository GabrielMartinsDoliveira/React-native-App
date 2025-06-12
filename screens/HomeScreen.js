import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, ActivityIndicator } from 'react-native';
import { FAB, Card, Text, IconButton, TextInput } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles';

// IMPORTANTE: Atualize conforme seu ambiente
const API_URL = 'http://192.168.0.8:3000'; // Para dispositivo físico
// const API_URL = 'http://10.0.2.2:3000'; // Para emulador Android
// const API_URL = 'http://localhost:3000'; // Para emulador iOS
const STORAGE_KEY = '@touristpoints_data';
const REQUEST_TIMEOUT = 10000; // 10 segundos

export default function HomeScreen() {
  const [touristPoints, setTouristPoints] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Função para fazer requisições com timeout
  const fetchWithTimeout = async (url, options = {}, timeout = REQUEST_TIMEOUT) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // Buscar pontos da API
  const fetchData = async (showAlert = true) => {
    try {
      setLoading(true);
      const data = await fetchWithTimeout(`${API_URL}/tourist-points`);
      
      setTouristPoints(data);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao buscar pontos turísticos:', error);
      
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          setTouristPoints(JSON.parse(storedData));
          if (showAlert) {
            Alert.alert(
              'Aviso', 
              'Dados carregados do armazenamento local. Verifique sua conexão com o servidor.'
            );
          }
        }
      } catch (storageError) {
        console.error('Erro ao carregar do AsyncStorage:', storageError);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Atualizar ao puxar a lista
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(false);
  };

  // Deletar ponto turístico
  const handleDelete = async (id) => {
    Alert.alert('Confirmar', 'Deseja realmente deletar este ponto turístico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetchWithTimeout(`${API_URL}/tourist-points/${id}`, {
              method: 'DELETE',
            });
            
            Alert.alert('Sucesso', 'Ponto turístico deletado.');
            fetchData(false);
          } catch (err) {
            console.error('Erro ao deletar:', err);
            Alert.alert(
              'Erro', 
              err.message.includes('aborted') 
                ? 'Tempo excedido ao conectar com o servidor' 
                : 'Erro ao deletar ponto turístico'
            );
          }
        },
      },
    ]);
  };

  // Buscar por nome
  const searchTouristPoints = async (text) => {
    setSearchText(text);
    if (!text) return fetchData(false);

    try {
      const data = await fetchWithTimeout(
        `${API_URL}/tourist-points/search?name=${encodeURIComponent(text)}`
      );
      setTouristPoints(data);
    } catch (err) {
      console.error('Erro na busca:', err);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  if (loading && !refreshing && touristPoints.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Carregando pontos turísticos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Buscar por nome"
        mode="outlined"
        value={searchText}
        onChangeText={searchTouristPoints}
        style={{ margin: 16 }}
        left={<TextInput.Icon icon="magnify" />}
      />

      <FlatList
        data={touristPoints}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge">{item.name}</Text>
              <Text variant="bodyMedium" numberOfLines={2}>
                {item.description}
              </Text>
            </Card.Content>
            {item.photo && (
              <Card.Cover
                source={{ 
                  uri: item.photo.startsWith('http') 
                    ? item.photo 
                    : `${API_URL}/uploads/${item.photo.replace(/^.*[\\\/]/, '')}`
                }}
                style={styles.image}
              />
            )}
            <Card.Actions>
              <IconButton
                icon="pencil"
                onPress={() =>
                  navigation.navigate('Editar Ponto Turístico', { point: item })
                }
              />
              <IconButton
                icon="delete"
                onPress={() => handleDelete(item.id)}
              />
            </Card.Actions>
          </Card>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum ponto turístico encontrado
          </Text>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Adicionar Ponto Turístico')}
      />
      <FAB
        icon="map"
        style={styles.mapButton}
        onPress={() => navigation.navigate('Mapa')}
      />
    </View>
  );
}