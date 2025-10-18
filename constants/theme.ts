/**
 * Night-mode focused design system with minimalist, clean aesthetics
 * Optimized for bedtime reading with subtle dark gradients and star-like elements
 */

import { Platform } from 'react-native';

// Night-mode focused color palette
const tintColorLight = '#6366f1'; // Indigo for light mode accent
const tintColorDark = '#a5b4fc'; // Soft lavender for dark mode

export const Colors = {
  light: {
    text: '#1f2937', // Dark gray for readability
    background: '#f8fafc', // Very light gray
    tint: tintColorLight,
    icon: '#6b7280',
    tabIconDefault: '#9ca3af',
    tabIconSelected: tintColorLight,
    // Additional night-mode focused colors
    cardBackground: '#ffffff',
    borderColor: '#e5e7eb',
    placeholderText: '#9ca3af',
    accent: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  dark: {
    text: '#f1f5f9', // Soft white for eye comfort
    background: '#0f172a', // Deep navy base
    tint: tintColorDark,
    icon: '#94a3b8', // Muted blue-gray
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
    // Night-mode specific colors
    cardBackground: '#1e293b', // Darker navy for cards
    borderColor: '#334155', // Subtle border
    placeholderText: '#64748b',
    accent: '#a5b4fc', // Soft lavender
    success: '#34d399', // Soft green
    warning: '#fbbf24', // Soft amber
    error: '#f87171', // Soft red
    // Gradient colors for night ambiance
    gradientStart: '#0f172a',
    gradientEnd: '#1e293b',
    starColor: '#a5b4fc',
    // Glass effect colors
    glassBackground: 'rgba(30, 41, 59, 0.4)',
    glassBorder: 'rgba(148, 163, 184, 0.2)',
  },
};

// SF Pro Text font family optimized for bedtime reading
export const Fonts = Platform.select({
  ios: {
    /** SF Pro Text - Apple's clean, readable font */
    sans: 'SF Pro Text',
    /** SF Pro Display for larger text */
    display: 'SF Pro Display',
    /** SF Pro Rounded for friendly elements */
    rounded: 'SF Pro Rounded',
    /** SF Mono for code/monospace */
    mono: 'SF Mono',
  },
  default: {
    sans: 'SF Pro Text',
    display: 'SF Pro Display',
    rounded: 'SF Pro Rounded',
    mono: 'SF Mono',
  },
  web: {
    sans: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    display: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    rounded: "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Typography scale optimized for night reading
export const Typography = {
  // Font sizes with generous line heights for comfortable reading
  xs: { fontSize: 12, lineHeight: 18 },
  sm: { fontSize: 14, lineHeight: 22 },
  base: { fontSize: 16, lineHeight: 26 },
  lg: { fontSize: 18, lineHeight: 30 },
  xl: { fontSize: 20, lineHeight: 32 },
  '2xl': { fontSize: 24, lineHeight: 36 },
  '3xl': { fontSize: 30, lineHeight: 42 },
  '4xl': { fontSize: 36, lineHeight: 48 },
  '5xl': { fontSize: 48, lineHeight: 60 },
  
  // Font weights
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Spacing for generous whitespace
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
  },
};
