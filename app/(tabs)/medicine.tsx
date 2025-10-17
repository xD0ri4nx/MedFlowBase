import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MedicineScreen() {
    const [medicine, setMedicine] = useState('');
    const [time, setTime] = useState('');
    const [list, setList] = useState<{ name: string; time: string }[]>([]);

    const addMedicine = () => {
        if (medicine && time) {
            setList([...list, { name: medicine, time }]);
            setMedicine('');
            setTime('');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
                <Text style={styles.headerTitle}>Medicine Tracker</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Add a Medicine</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Medicine name"
                        placeholderTextColor="#999"
                        value={medicine}
                        onChangeText={setMedicine}
                    />
                    <TextInput
                        style={[styles.input, { marginTop: 10 }]}
                        placeholder="Time (e.g. 08:00, 14:00)"
                        placeholderTextColor="#999"
                        value={time}
                        onChangeText={setTime}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addMedicine}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Your Medicines</Text>
                    {list.length === 0 ? (
                        <Text style={{ color: '#666' }}>No medicines added yet.</Text>
                    ) : (
                        list.map((item, idx) => (
                            <View key={idx} style={styles.itemRow}>
                                <Text style={styles.itemText}>💊 {item.name}</Text>
                                <Text style={styles.itemTime}>⏰ {item.time}</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    content: { padding: 20 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    sectionTitle: { fontSize: 18, color: '#b22222', fontWeight: '600', marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 45,
        color: '#222',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#ff6f61',
        borderRadius: 12,
        paddingVertical: 10,
        marginTop: 15,
        alignItems: 'center',
    },
    addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    itemText: { color: '#222', fontSize: 16 },
    itemTime: { color: '#555', fontSize: 16 },
});
