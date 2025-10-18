import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Custom dark theme optimized for night reading
const NightTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#a5b4fc', // Soft lavender
    background: '#0f172a', // Deep navy
    card: '#1e293b', // Darker navy for cards
    text: '#f1f5f9', // Soft white
    border: '#334155', // Subtle border
    notification: '#a5b4fc', // Soft lavender
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={NightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" backgroundColor="#0f172a" />
    </ThemeProvider>
  );
}
