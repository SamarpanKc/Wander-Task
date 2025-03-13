// Import necessary modules
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
// Define the useColorScheme hook
export function useColorScheme() {
  // Initialize the hasHydrated state
  const [hasHydrated, setHasHydrated] = useState(false);

  // Set hasHydrated to true on component mount
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Get the color scheme from react-native
  const colorScheme = useRNColorScheme();

  // Return the color scheme if the component has hydrated, otherwise return 'light'
  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
