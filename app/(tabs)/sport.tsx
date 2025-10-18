import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { supabase } from '@/lib/supabase';

export default function SportScreen() {
    const [activity, setActivity] = useState<string | null>(null);
    const [steps, setSteps] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const levels = [
        { label: 'No Activity', value: 'none' },
        { label: 'Light', value: 'light' },
        { label: 'Medium', value: 'medium' },
        { label: 'Intense', value: 'intense' },
    ];

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    //const supabase = createClient(supabaseUrl!, supabaseKey!);

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

    const handleSave = async () => {
        if (!userId) {
            Alert.alert('Error', 'You must be logged in to save sport records');
            return;
        }

        try {
            setLoading(true);
            const details = {
                steps: steps || '-',
                activity: activity || '-',
            };
            const { error } = await supabase
                .from('general')
                .insert([{
                    user_id: userId,
                    type: 'sport',
                    details: JSON.stringify(details),
                    data: new Date().toISOString().slice(0, 10),
                }]);
            if (error) throw error;

            console.log('Success: Your sport record has been saved!');
            Alert.alert('Success', 'Your sport record has been saved!');
            setSteps('');
            setActivity(null);
        } catch (err: any) {
            console.error('Error saving sport record:', err);
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
                <Text style={styles.headerTitle}>Sport Tracker</Text>
                {userId && (
                    <Text style={styles.userIdText}>User ID: {userId.slice(0, 8)}...</Text>
                )}
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
                style={[styles.saveButton, (loading || !userId) && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={loading || !userId}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>
                        {userId ? 'Save' : 'Login Required'}
                    </Text>
                )}
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
    userIdText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
        opacity: 0.8,
    },
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
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});