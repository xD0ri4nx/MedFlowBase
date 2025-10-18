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

export default function FoodTrackingScreen() {
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [water, setWater] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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