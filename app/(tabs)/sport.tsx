import { createClient } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SportScreen() {
    const [activity, setActivity] = useState<string | null>(null);
    const [steps, setSteps] = useState('');
    const [loading, setLoading] = useState(false);

    const levels = [
        { label: 'No Activity', value: 'none' },
        { label: 'Light', value: 'light' },
        { label: 'Medium', value: 'medium' },
        { label: 'Intense', value: 'intense' },
    ];

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    const handleSave = async () => {
        try {
            setLoading(true);
            const details = {
                steps: steps || '-',
                activity: activity || '-',
            };
            const { error } = await supabase
                .from('general')
                .insert([{
                    type: 'sport',
                    details: JSON.stringify(details),
                    data: new Date().toISOString().slice(0, 10),
                }]);
            if (error) throw error;
            Alert.alert('Success', 'Your sport record has been saved!');
            setSteps('');
            setActivity(null);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
                <Text style={styles.headerTitle}>Sport Tracker</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Activity Level</Text>
                    <View style={styles.levelContainer}>
                        {levels.map((lvl) => (
                            <TouchableOpacity
                                key={lvl.value}
                                style={[
                                    styles.levelButton,
                                    activity === lvl.value && styles.levelActive,
                                ]}
                                onPress={() => setActivity(lvl.value)}
                            >
                                <Text
                                    style={[
                                        styles.levelText,
                                        activity === lvl.value && styles.levelTextActive,
                                    ]}
                                >
                                    {lvl.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Steps Today</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter number of steps"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={steps}
                        onChangeText={setSteps}
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
            >
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
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
    levelContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    levelButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 10,
        marginBottom: 10,
    },
    levelActive: { backgroundColor: '#ff6f61', borderColor: '#ff6f61' },
    levelText: { color: '#222', fontSize: 16 },
    levelTextActive: { color: '#fff', fontWeight: '600' },
    saveButton: {
        backgroundColor: '#ff6f61',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: { color: '#fff', fontSize: 16 },
});
