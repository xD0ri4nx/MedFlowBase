import { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

import { DarkVeilBackground } from '@/components/dark-veil-background';
import { GlassCard } from '@/components/glass-card';
import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createClient } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in environment variables');
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

export default function FoodTrackingScreen() {
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [water, setWater] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      const details = {
        breakfast: breakfast || '-',
        lunch: lunch || '-',
        dinner: dinner || '-',
        water: water ? `${water}L` : '-'
      };

      const { error } = await supabase
        .from('general')
        .insert([{ 
          type: 'consum', 
          details: JSON.stringify(details),
          data: new Date().toISOString().slice(0, 10)
        }]);

      if (error) throw error;

  console.log('Success: Your meal record has been saved!');
  Alert.alert('Success', 'Your meal record has been saved!');
      setBreakfast('');
      setLunch('');
      setDinner('');
      setWater('');
    } catch (err: any) {
  console.log('Error:', err.message);
  Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWaterChange = (text: string) => {
    const clean = text.replace(',', '.');
    setWater(clean);

    const value = parseFloat(clean);
    if (!isNaN(value) && value >= 2) {
      setShowModal(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

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
          <ThemedText type="title" style={styles.headerTitle}>
            Food & Water Tracker
          </ThemedText>
        </View>

        {/* Content Cards */}
        <View style={styles.content}>
          {/* Breakfast Card */}
          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <ThemedText type="subtitle" style={[styles.sectionTitle, { color: accentColor }]}>
                🍳 Breakfast
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: Colors.dark.text,
                    borderColor: Colors.dark.borderColor,
                    backgroundColor: 'rgba(30, 41, 59, 0.3)',
                  }
                ]}
                placeholder="Add food items..."
                placeholderTextColor={placeholderText}
                value={breakfast}
                onChangeText={setBreakfast}
              />
            </View>
          </GlassCard>

          {/* Lunch Card */}
          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <ThemedText type="subtitle" style={[styles.sectionTitle, { color: accentColor }]}>
                🥗 Lunch
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: Colors.dark.text,
                    borderColor: Colors.dark.borderColor,
                    backgroundColor: 'rgba(30, 41, 59, 0.3)',
                  }
                ]}
                placeholder="Add food items..."
                placeholderTextColor={placeholderText}
                value={lunch}
                onChangeText={setLunch}
              />
            </View>
          </GlassCard>

          {/* Dinner Card */}
          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <ThemedText type="subtitle" style={[styles.sectionTitle, { color: accentColor }]}>
                🍝 Dinner
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: Colors.dark.text,
                    borderColor: Colors.dark.borderColor,
                    backgroundColor: 'rgba(30, 41, 59, 0.3)',
                  }
                ]}
                placeholder="Add food items..."
                placeholderTextColor={placeholderText}
                value={dinner}
                onChangeText={setDinner}
              />
            </View>
          </GlassCard>

          {/* Water Card */}
          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <ThemedText type="subtitle" style={[styles.sectionTitle, { color: accentColor }]}>
                💧 Water intake (L)
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: Colors.dark.text,
                    borderColor: Colors.dark.borderColor,
                    backgroundColor: 'rgba(30, 41, 59, 0.3)',
                  }
                ]}
                placeholder="Enter liters (e.g. 1.5)"
                placeholderTextColor={placeholderText}
                keyboardType="decimal-pad"
                value={water}
                onChangeText={handleWaterChange}
              />
            </View>
          </GlassCard>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Daily Food Record</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ThemedText type="title" style={[styles.modalTitle, { color: accentColor }]}>
              🎉 Congratulations!
            </ThemedText>
            <ThemedText type="default" style={styles.modalText}>
              You hit your water goal for today 💧
            </ThemedText>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: accentColor }]}
              onPress={() => setShowModal(false)}
            >
              <ThemedText type="default" style={styles.modalButtonText}>
                OK
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showConfetti && (
        <ConfettiCannon
          count={80}
          origin={{ x: 200, y: 0 }}
          fadeOut
          fallSpeed={3000}
        />
      )}
    </DarkVeilBackground>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#ff4b5c',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  headerTitle: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Typography.spacing.lg,
    paddingTop: Typography.spacing.sm,
  },
  card: {
    marginBottom: Typography.spacing.lg,
    minHeight: 120,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: Typography.spacing.md,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Typography.spacing.lg,
    height: 56,
    fontSize: Typography.base.fontSize,
    fontFamily: 'SF Pro Text',
    textAlign: 'center',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 24,
    padding: Typography.spacing['2xl'],
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.borderColor,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: Typography.spacing.md,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: Typography.spacing.lg,
  },
  modalButton: {
    paddingHorizontal: Typography.spacing['2xl'],
    paddingVertical: Typography.spacing.md,
    borderRadius: 16,
  },
  modalButtonText: {
    color: Colors.dark.text,
    fontWeight: Typography.weights.semibold,
    fontSize: Typography.base.fontSize,
  },
});