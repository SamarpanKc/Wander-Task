// Import necessary modules
import { useEffect } from 'react';

// Declare global interface to allow frameworkReady function
declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

// Define the useFrameworkReady hook
export function useFrameworkReady() {
  // Call window.frameworkReady on component mount
  useEffect(() => {
    window.frameworkReady?.();
  });
}
