import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle' | 'caption' | 'link' | 'display';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'display' ? styles.display : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.sans,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: Typography.weights.normal,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: Typography['3xl'].fontSize,
    lineHeight: Typography['3xl'].lineHeight,
    fontWeight: Typography.weights.bold,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: Typography.weights.semibold,
  },
  caption: {
    fontFamily: Fonts.sans,
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: Typography.weights.normal,
    opacity: 0.8,
  },
  link: {
    fontFamily: Fonts.sans,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: Typography.weights.medium,
    textDecorationLine: 'underline',
  },
  display: {
    fontFamily: Fonts.display,
    fontSize: Typography['5xl'].fontSize,
    lineHeight: Typography['5xl'].lineHeight,
    fontWeight: Typography.weights.bold,
  },
});
