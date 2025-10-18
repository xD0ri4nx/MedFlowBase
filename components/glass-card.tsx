import { useThemeColor } from '@/hooks/use-theme-color';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface GlassCardProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  variant?: 'primary' | 'secondary';
  noShadow?: boolean;
}

export function GlassCard({ 
  children, 
  style, 
  intensity = 20,
  variant = 'primary',
  noShadow = false
}: GlassCardProps) {
  const borderColor = useThemeColor({}, 'borderColor');
  const cardBackground = useThemeColor({}, 'cardBackground');

  return (
    <View style={[styles.container, noShadow && styles.noShadow, style]}>
      {/* Shiny reflective border effect */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.1)',
          'rgba(255, 255, 255, 0.05)',
          'rgba(255, 255, 255, 0.02)',
          'rgba(255, 255, 255, 0.05)',
          'rgba(255, 255, 255, 0.1)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.shinyBorder}
      />
      
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[styles.blurContainer, { borderColor }]}
      >
        <View style={[styles.content, { backgroundColor: cardBackground }]}>
          {children}
        </View>
      </BlurView>
      
      {/* Inner highlight for extra shine */}
      <View style={styles.innerHighlight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  noShadow: {
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  shinyBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    zIndex: 1,
  },
  blurContainer: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 2,
  },
  content: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    minHeight: 120, // Ensure equal height for all cards
    justifyContent: 'center', // Center content vertically
  },
  innerHighlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    zIndex: 3,
  },
});
