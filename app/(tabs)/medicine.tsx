import { createClient } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MedicineScreen() {
    // Supabase client (reads EXPO_PUBLIC_ env vars)
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl || '', supabaseKey || '');

    const [medicine, setMedicine] = useState('');
    const [time, setTime] = useState('');
    const [list, setList] = useState<{ name: string; time: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const addMedicine = async () => {
        if (!medicine || !time) return;

        try {
            setLoading(true);

            const details = { name: medicine, time };
                const { data, error } = await supabase
                    .from('general')
                    .insert([
                        { type: 'medicamente', details: JSON.stringify(details), data: new Date().toISOString().slice(0,10) }
                    ])
                    .select();

                console.log('Supabase insert response:', { data, error });

                if (error) throw error;

                // push local list
                setList([...list, { name: medicine, time }]);
            setMedicine('');
            setTime('');
            console.log('Medicine saved');
            Alert.alert('Saved', 'Medicine record saved to database');
        } catch (err: any) {
            console.error('Error saving medicine:', err.message || err);
            Alert.alert('Error', err.message || 'Could not save medicine');
        } finally {
            setLoading(false);
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
                    <TouchableOpacity 
                        style={[styles.addButton, loading && styles.saveButtonDisabled]} 
                        onPress={addMedicine} 
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.addButtonText}>Add</Text>
                        )}
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
    saveButtonDisabled: {
        opacity: 0.7,
    },
    addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    itemText: { color: '#222', fontSize: 16 },
    itemTime: { color: '#555', fontSize: 16 },
});
