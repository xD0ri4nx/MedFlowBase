import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { supabase } from '@/lib/supabase';


// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in environment variables');
}

//const supabase = createClient(supabaseUrl!, supabaseKey!);

export default function HomeScreen() {
  const [hours, setHours] = useState('');
  const [wakeUps, setWakeUps] = useState('');
  const [emoji, setEmoji] = useState('🤔');
  const [quality, setQuality] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user on component mount
    getCurrentUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        console.log('User logged in:', session.user.id);
      } else {
        setUserId(null);
        console.log('User logged out');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error getting user:', error);
        return;
      }

      if (user) {
        setUserId(user.id);
        console.log('Current user ID:', user.id);
      } else {
        console.log('No user logged in');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const getQualityFromHours = (hours: number): string => {
    if (hours <= 4) return 'slab';
    if (hours <= 6) return 'mediu';
    if (hours <= 8) return 'bun';
    return 'excelent';
  };

  const saveSleepRecord = async (hours: number) => {
    if (!hours) {
      Alert.alert('Error', 'Please enter number of hours');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'You must be logged in to save records');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('general')
        .insert([
          {
            user_id: userId,
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

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
        <Image
          source={require('@/assets/images/medflow_logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>MedFlow</Text>
        {userId && (
          <Text style={styles.userIdText}>User ID: {userId.slice(0, 8)}...</Text>
        )}
        <View style={styles.menu}>
          <Text style={[styles.menuItem, styles.activeMenu]}>daily</Text>
          <Text style={styles.menuItem}>weekly</Text>
          <Text style={styles.menuItem}>monthly</Text>
          <Text style={styles.menuItem}>yearly</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={{ color: '#b22222' }}>You are on a 3-day streak! 🔥</ThemedText>
        </ThemedView>

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
            style={[styles.addButton, (loading || !hours || !userId) && styles.saveButtonDisabled]}
            onPress={() => saveSleepRecord(parseInt(hours, 10))}
            disabled={loading || !hours || !userId}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>
                {userId ? 'Save Sleep Record' : 'Login Required'}
              </Text>
            )}
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.cardCenter}>
          <ThemedText type="subtitle" style={{ color: '#b22222' }}>Your current state:</ThemedText>
          <ThemedText type="title">{emoji}</ThemedText>
        </ThemedView>
      </View>

      <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.navbar}>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff4b5c',
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
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  logo: {
    height: 80,
    width: 130,
    marginBottom: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  userIdText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
    marginTop: 4,
  },
  menu: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-around',
    width: '90%',
  },
  menuItem: {
    color: 'white',
    opacity: 0.7,
    fontSize: 14,
  },
  activeMenu: {
    opacity: 1,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: 20,
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardCenter: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  navbar: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: 'absolute',
  },
  navText: {
    color: 'white',
    fontSize: 22,
  },
});