import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [hours, setHours] = useState('');
  const [emoji, setEmoji] = useState('🤔');

  const handleChange = (text: string) => {
    const value = text.replace(/[^0-9]/g, '');
    setHours(value);

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setEmoji('🤔');
    } else if (num <= 4) {
      setEmoji('🤕');
    } else if (num <= 6) {
      setEmoji('😴');
    } else {
      setEmoji('💪');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
        <Image
          source={require('@/assets/images/MedFlow-logo.png')}
          style={styles.logo}
        />
        {/* <Text style={styles.headerTitle}>MedFlow</Text> */}
        <View style={styles.menu}>
          <Text style={[styles.menuItem, styles.activeMenu]}>Daily</Text>
          <Text style={styles.menuItem}>Weekly</Text>
          <Text style={styles.menuItem}>Monthly</Text>
          <Text style={styles.menuItem}>Yearly</Text>
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
            onChangeText={handleChange}
          />
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
