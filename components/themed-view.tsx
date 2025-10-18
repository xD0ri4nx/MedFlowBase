import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'background' | 'card' | 'surface';
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  variant = 'background',
  ...otherProps 
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { 
      light: lightColor, 
      dark: darkColor 
    }, 
    variant === 'card' ? 'cardBackground' : 'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
