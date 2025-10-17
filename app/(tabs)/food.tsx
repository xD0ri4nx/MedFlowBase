import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

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

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
        <Text style={styles.headerTitle}>Food & Water Tracker</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🍳 Breakfast</Text>
          <TextInput
            style={styles.input}
            placeholder="Add food items..."
            placeholderTextColor="#999"
            value={breakfast}
            onChangeText={setBreakfast}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🥗 Lunch</Text>
          <TextInput
            style={styles.input}
            placeholder="Add food items..."
            placeholderTextColor="#999"
            value={lunch}
            onChangeText={setLunch}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🍝 Dinner</Text>
          <TextInput
            style={styles.input}
            placeholder="Add food items..."
            placeholderTextColor="#999"
            value={dinner}
            onChangeText={setDinner}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💧 Water intake (L)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter liters (e.g. 1.5)"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            value={water}
            onChangeText={handleWaterChange}
          />
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
            <Text style={styles.modalTitle}>🎉 Congratulations!</Text>
            <Text style={styles.modalText}>You hit your water goal for today 💧</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#b22222',
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    color: '#222',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#b22222',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#ff6f61',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
