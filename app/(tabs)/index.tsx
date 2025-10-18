import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { DarkVeilBackground } from '@/components/dark-veil-background';
import { GlassCard } from '@/components/glass-card';
import { SleepIndicator } from '@/components/sleep-indicator';
import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const [hours, setHours] = useState('');
  const [debouncedHours, setDebouncedHours] = useState('');
  
  // Debounce the hours input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHours(hours);
    }, 50); // Reduced to 50ms for faster response

    return () => clearTimeout(timer);
  }, [hours]);

  // Parse sleep hours with debouncing for optimal performance
  const sleepHours = useMemo(() => parseInt(debouncedHours, 10) || 0, [debouncedHours]);

  // Handle input changes with immediate visual feedback and validation
  const handleChange = (text: string) => {
    // Allow only numbers and limit to 2 digits
    const value = text.replace(/[^0-9]/g, '').slice(0, 2);
    // Validate range (0-24 hours)
    const numValue = parseInt(value, 10);
    if (value === '' || (numValue >= 0 && numValue <= 24)) {
      setHours(value);
    }
  };

  // Handle Enter key press - update immediately
  const handleSubmit = () => {
    setDebouncedHours(hours); // Force immediate update
  };


  // Memoize theme colors to prevent unnecessary re-renders
  const accentColor = useThemeColor({}, 'accent');
  const placeholderText = useThemeColor({}, 'placeholderText');

  return (
    <DarkVeilBackground style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/MedFlow-logo.png')}
            style={styles.logo}
          />
          <View style={styles.menu}>
            <ThemedText style={[styles.menuItem, styles.activeMenu]}>Daily</ThemedText>
            <ThemedText style={styles.menuItem}>Weekly</ThemedText>
            <ThemedText style={styles.menuItem}>Monthly</ThemedText>
            <ThemedText style={styles.menuItem}>Yearly</ThemedText>
          </View>
        </View>

        {/* Content Cards */}
        <View style={styles.content}>
          {/* Combined Streak & Sleep Input Card */}
          <GlassCard style={styles.combinedCard} noShadow={true}>
            <View style={styles.combinedCardContent}>
              {/* Streak Section */}
              <View style={styles.streakSection}>
                <ThemedText type="subtitle" style={[styles.cardTitle, { color: accentColor }]}>
                  You are on a 3-day streak! 🔥
                </ThemedText>
              </View>
              
              {/* Divider */}
              <View style={styles.divider} />
              
              {/* Sleep Input Section */}
              <View style={styles.sleepSection}>
                <ThemedText type="subtitle" style={[styles.cardTitle, { color: accentColor }]}>
                  How much did you sleep last night?
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: Colors.dark.text,
                    }
                  ]}
                  placeholder="Enter the number of hours you slept"
                  placeholderTextColor={placeholderText}
                  keyboardType="numeric"
                  value={hours}
                  onChangeText={handleChange}
                  onSubmitEditing={handleSubmit}
                  maxLength={2}
                  returnKeyType="done"
                  autoComplete="off"
                  autoCorrect={false}
                  autoCapitalize="none"
                  selectTextOnFocus={true}
                />
              </View>
            </View>
          </GlassCard>

          {/* Sleep Quality Card */}
          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <ThemedText type="subtitle" style={[styles.cardTitle, { color: accentColor }]}>
                Your sleep quality:
              </ThemedText>
              <SleepIndicator hours={sleepHours} size="large" />
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </DarkVeilBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Typography.spacing['4xl'],
  },
  header: {
    paddingTop: Typography.spacing['4xl'],
    paddingBottom: Typography.spacing['3xl'],
    paddingHorizontal: Typography.spacing.lg,
    alignItems: 'center',
  },
  logo: {
    height: 100,
    width: 160,
    marginBottom: Typography.spacing.sm,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: Typography.spacing.sm,
  },
  menuItem: {
    fontSize: Typography.base.fontSize,
    fontWeight: Typography.weights.normal,
    opacity: 0.7,
  },
  activeMenu: {
    opacity: 1,
    fontWeight: Typography.weights.semibold,
  },
  content: {
    flex: 1,
    paddingHorizontal: Typography.spacing.lg,
    paddingTop: Typography.spacing.sm, // Reduced padding to bring cards closer to menu
  },
  card: {
    marginBottom: Typography.spacing.lg,
    minHeight: 160, // Ensure all cards have equal minimum height
  },
  sleepInputCard: {
    marginBottom: Typography.spacing.lg,
    minHeight: 160,
    borderTopLeftRadius: 0, // Remove top border radius to connect with streak card
    borderTopRightRadius: 0, // Remove top border radius to connect with streak card
  },
  streakCard: {
    marginBottom: 0, // Remove margin below streak card
    minHeight: 160,
    shadowOpacity: 0, // Remove shadow completely
    elevation: 0, // Remove elevation for Android
    borderBottomLeftRadius: 0, // Remove bottom border radius
    borderBottomRightRadius: 0, // Remove bottom border radius
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  combinedCard: {
    marginBottom: Typography.spacing.lg,
    minHeight: 120, // Much smaller height for compact design
    shadowOpacity: 0, // Remove shadow completely
    elevation: 0, // Remove elevation for Android
  },
  combinedCardContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  streakSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sleepSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    marginVertical: 6,
  },
  cardTitle: {
    marginBottom: Typography.spacing.md,
    textAlign: 'center',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Typography.spacing.lg,
    fontSize: Typography.base.fontSize,
    marginTop: Typography.spacing.md,
    fontFamily: 'SF Pro Text',
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    textAlign: 'center',
    width: '100%',
  },
});