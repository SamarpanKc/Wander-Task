// Import necessary modules
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

// Define interface for location change events
interface LocationChangeEvent {
  locations: Location.LocationObject[];
}

// Define the name of the background location task
const LOCATION_TASK_NAME = 'background-location-task';

// Define the useLocationPermissions hook
export function useLocationPermissions() {
  // Initialize the status state
  const [status, setStatus] = useState<{
    foreground: boolean;
    background: boolean;
    message: string;
  }>({
    foreground: false,
    background: false,
    message: '',
  });

  // Request location permissions on component mount
  useEffect(() => {
    (async () => {
      // Request foreground location permissions
      const { status: foregroundStatus } = 
        await Location.requestForegroundPermissionsAsync();
      
      // Request background location permissions if foreground permissions are granted
      let backgroundStatus: { granted: boolean } = { granted: false };
      if (foregroundStatus === 'granted') {
        backgroundStatus = 
          await Location.requestBackgroundPermissionsAsync();
      }

      // Update the status state
      setStatus({
        foreground: foregroundStatus === 'granted',
        background: backgroundStatus.granted,
        message: foregroundStatus === 'granted' && backgroundStatus.granted ? 'Location permissions granted' : '',
      });

      // Only try to start location updates if permissions are granted
      if (foregroundStatus === 'granted' && backgroundStatus.granted) {
        try {
          const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
          if (!isRegistered) {
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 60000, // Update every minute
              distanceInterval: 10, // Update every 10 meters
              deferredUpdatesInterval: 60000, // Minimum time between updates
              deferredUpdatesDistance: 10,
              foregroundService: {
                notificationTitle: 'Location Tracking',
                notificationBody: 'Tracking your location for task reminders',
              },
            });
          }
        } catch (error) {
          console.error("Failed to start location updates:", error);
          // Don't throw the error to prevent component from breaking
        }
      }
    })();

    // Clean up background location task on component unmount
    return () => {
      TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then(
        (isRegistered) => {
          if (isRegistered) {
            Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
          }
        }
      );
    };
  }, []);

  // Return the status state
  return status;
}

// Define the background location task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }

  if (data) {
    // Check for background permissions before processing location data
    const { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      const { locations } = data as { locations: Location.LocationObject[] };
      if (locations && locations.length > 0) {
        const { latitude, longitude } = locations[0].coords;
        //setLocation({ latitude, longitude });
        //setLoading(false);
        //console.log('Location update:', locations);
      }
    } else {
      console.log('Background location permissions not granted');
    }
  }
});