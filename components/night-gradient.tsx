import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

interface NightGradientProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'card';
  style?: ViewStyle;
}

export function NightGradient({ 
  children, 
  variant = 'primary', 
  style 
}: NightGradientProps) {
  const gradientStart = useThemeColor({}, 'gradientStart');
  const gradientEnd = useThemeColor({}, 'gradientEnd');
  const cardBackground = useThemeColor({}, 'cardBackground');

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return [gradientStart, gradientEnd];
      case 'secondary':
        return [gradientEnd, gradientStart];
      case 'card':
        return [cardBackground, gradientEnd];
      default:
        return [gradientStart, gradientEnd];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
