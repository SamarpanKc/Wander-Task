import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTaskStore } from '@/hooks/useTaskStore';
import { Task } from '@/types/task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useThemeColor } from '@/hooks/useThemeColor';

const LOCATION_STORAGE_KEY = '@userLocation';

export default function MapScreen() {
  const { tasks } = useTaskStore();
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(
    null
  );
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    loadStoredLocation();
    getLocation();

    // Set up interval to periodically get location and store it
    const intervalId = setInterval(getLocation, 60000); // Every 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        return;
      }

      const isConnected = (await NetInfo.fetch()).isConnected;

      if (isConnected) {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        storeLocation(location);
      } else {
        console.log('No internet connection, using stored location');
        loadStoredLocation();
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const storeLocation = async (location: Location.LocationObject) => {
    try {
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    } catch (error) {
      console.error('Error storing location:', error);
    }
  };

  const loadStoredLocation = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      if (storedLocation) {
        setUserLocation(JSON.parse(storedLocation));
      }
    } catch (error) {
      console.error('Error loading stored location:', error);
    }
  };

  useEffect(() => {
    if (userLocation && tasks.length > 0) {
      adjustMapRegion();
    } else if (userLocation) {
      // If only user location is available, zoom to user location
      mapRef.current?.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }, [userLocation, tasks]);

  const adjustMapRegion = () => {
    if (!userLocation) return;

    const allPoints = [
      {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      },
      ...tasks.map((task) => ({
        latitude: task.location.latitude,
        longitude: task.location.longitude,
      })),
    ];

    // Calculate boundaries
    let minLat = allPoints[0].latitude;
    let maxLat = allPoints[0].latitude;
    let minLng = allPoints[0].longitude;
    let maxLng = allPoints[0].longitude;

    for (const point of allPoints) {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLng = Math.min(minLng, point.longitude);
      maxLng = Math.max(maxLng, point.longitude);
    }

    // Calculate center and delta
    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLng + maxLng) / 2;
    const latitudeDelta = (maxLat - minLat) * 1.2; // Add a bit of padding
    const longitudeDelta = (maxLng - minLng) * 1.2; // Add a bit of padding

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      },
      1000
    );
  };

  const renderTaskMarker = (task: Task) => {
    const priorityColors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#F44336',
    };

    return (
      <React.Fragment key={task.id}>
        <Marker
          coordinate={{
            latitude: task.location.latitude,
            longitude: task.location.longitude,
          }}
          title={task.title}
          description={task.description}
          pinColor={priorityColors[task.priority]}
        />
        <Circle
          center={{
            latitude: task.location.latitude,
            longitude: task.location.longitude,
          }}
          radius={task.location.radius}
          strokeWidth={1}
          strokeColor={priorityColors[task.priority]}
          fillColor={`${priorityColors[task.priority]}20`}
        />
      </React.Fragment>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: useThemeColor({}, 'background') }]}>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="You are here"
            pinColor="#007AFF"
          />
        )}
        {tasks.map(renderTaskMarker)}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});