/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

// Import necessary modules and constants
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define the useThemeColor hook
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // Get the current color scheme
  const theme = useColorScheme() ?? 'light';
  // Get the color from props based on the current theme
  const colorFromProps = props[theme];

  // Return the color from props if it exists, otherwise return the color from the Colors constant
  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
