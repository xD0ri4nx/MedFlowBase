import { createClient } from '@supabase/supabase-js';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { DarkVeilBackground } from '@/components/dark-veil-background';
import { GlassCard } from '@/components/glass-card';
import { SleepIndicator } from '@/components/sleep-indicator';
import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in environment variables');
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

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
  const [wakeUps, setWakeUps] = useState('');
  const [emoji, setEmoji] = useState('🤔');
  const [quality, setQuality] = useState('');
  const [loading, setLoading] = useState(false);

  const getQualityFromHours = (hours: number): string => {
    if (hours <= 4) return 'slab';
    if (hours <= 6) return 'mediu';
    if (hours <= 8) return 'bun';
    return 'excelent';
  };

  const saveSleepRecord = async (hours: number) => {
    if (!hours) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('general')
        .insert([
          {
            type: 'somn',
            details: JSON.stringify({
              ore_somn: hours,
              calitate: getQualityFromHours(hours),
              treziri: parseInt(wakeUps) || 0
            }),
            data: new Date().toISOString().slice(0, 10)
          }
        ]);

      if (error) {
        console.error('Error saving sleep record:', error);
        Alert.alert('Error', 'Could not save your sleep record');
        return false;
      }

      console.log('Success: Your sleep record has been saved!');
      Alert.alert('Success', 'Your sleep record has been saved!');
      
      // Clear inputs after successful save
      setHours('');
      setWakeUps('');
      setEmoji('🤔');
      setQuality('');
      
      return true;
    } catch (error) {
      console.error('Error saving sleep record:', error);
      console.log('Error: Could not save your sleep record');
      Alert.alert('Error', 'Could not save your sleep record');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleHoursChange = (text: string) => {
    const value = text.replace(/[^0-9]/g, '');
    setHours(value);

    const sleepHours = parseInt(value, 10);
    if (isNaN(sleepHours)) {
      setEmoji('🤔');
      setQuality('');
    } else {
      // Update emoji based on sleep hours
      if (sleepHours <= 4) {
        setEmoji('🤕'); // Sick/tired face for very little sleep
        setQuality('slab');
      } else if (sleepHours <= 6) {
        setEmoji('😴'); // Sleepy face for insufficient sleep
        setQuality('mediu');
      } else if (sleepHours <= 8) {
        setEmoji('😊'); // Happy face for good sleep
        setQuality('bun');
      } else {
        setEmoji('💪'); // Strong/energetic for optimal sleep
        setQuality('excelent');
      }
    }
  };

  // Handle Enter key press - update immediately
  const handleSubmit = () => {
    setDebouncedHours(hours); // Force immediate update
  };


  // Memoize theme colors to prevent unnecessary re-renders
  const accentColor = useThemeColor({}, 'accent');
  const placeholderText = useThemeColor({}, 'placeholderText');

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={{ color: '#b22222' }}>How much did you sleep last night?</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Insert number of hours"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={hours}
            onChangeText={handleHoursChange}
          />
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            placeholder="How many times did you wake up?"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={wakeUps}
            onChangeText={setWakeUps}
          />
          <TouchableOpacity 
            style={[styles.addButton, loading && styles.saveButtonDisabled]} 
            onPress={() => saveSleepRecord(parseInt(hours, 10))}
            disabled={loading || !hours}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Save Sleep Record</Text>
            )}
          </TouchableOpacity>
        </ThemedView>

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
  addButton: {
    backgroundColor: '#ff6f61',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16 
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