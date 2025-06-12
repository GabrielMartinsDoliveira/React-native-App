import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, ActivityIndicator, Image } from 'react-native';

const API_URL = 'http://192.168.0.8:3000';

export default function MapScreen() {
  const [touristPoints, setTouristPoints] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTouristPoints = async () => {
      try {
        const res = await fetch(`${API_URL}/TouristPoints`);
        const data = await res.json();
        setTouristPoints(data);

        if (data.length > 0) {
          // Filtra apenas pontos com coordenadas válidas
          const pointsWithCoords = data.filter(
            p => p.latitude !== null && p.longitude !== null
          );

          if (pointsWithCoords.length > 0) {
            const avgLat =
              pointsWithCoords.reduce((sum, p) => sum + Number(p.latitude), 0) / 
              pointsWithCoords.length;
            const avgLng =
              pointsWithCoords.reduce((sum, p) => sum + Number(p.longitude), 0) / 
              pointsWithCoords.length;

            setRegion({
              latitude: avgLat,
              longitude: avgLng,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            });
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching tourist points:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTouristPoints();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={region}>
        {touristPoints
          .filter(p => p.latitude && p.longitude)
          .map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: Number(point.latitude),
                longitude: Number(point.longitude),
              }}
              title={point.name}
              description={point.description}
            >
              {point.photo && (
                <Image 
                  source={{ uri: `${API_URL}/${point.photo}` }} 
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              )}
            </Marker>
          ))}
      </MapView>
    </View>
  );
}