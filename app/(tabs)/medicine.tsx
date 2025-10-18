import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { DarkVeilBackground } from '@/components/dark-veil-background';
import { GlassCard } from '@/components/glass-card';
import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
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
                        Medicine Tracker
                    </ThemedText>
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

                {/* Content Cards */}
                <View style={styles.content}>
                    {/* Add Medicine Card */}
                    <GlassCard style={styles.card}>
                        <View style={styles.cardContent}>
                            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: accentColor }]}>
                                Add a Medicine
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
                                placeholder="Medicine name"
                                placeholderTextColor={placeholderText}
                                value={medicine}
                                onChangeText={setMedicine}
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.secondInput,
                                    {
                                        color: Colors.dark.text,
                                        borderColor: Colors.dark.borderColor,
                                        backgroundColor: 'rgba(30, 41, 59, 0.3)',
                                    }
                                ]}
                                placeholder="Time (e.g. 08:00, 14:00)"
                                placeholderTextColor={placeholderText}
                                value={time}
                                onChangeText={setTime}
                            />
                            <TouchableOpacity 
                                style={[styles.addButton, { backgroundColor: accentColor }]} 
                                onPress={addMedicine}
                            >
                                <ThemedText type="default" style={styles.addButtonText}>
                                    Add
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>

                    {/* Medicine List Card */}
                    <GlassCard style={styles.card}>
                        <View style={styles.cardContent}>
                            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: accentColor }]}>
                                Your Medicines
                            </ThemedText>
                            {list.length === 0 ? (
                                <ThemedText type="caption" style={styles.emptyText}>
                                    No medicines added yet.
                                </ThemedText>
                            ) : (
                                list.map((item, idx) => (
                                    <View key={idx} style={styles.itemRow}>
                                        <View style={styles.medicineInfo}>
                                            <View style={styles.medicineIcon}>
                                                <ThemedText type="default" style={styles.iconText}>
                                                    ⚕
                                                </ThemedText>
                                            </View>
                                            <ThemedText type="default" style={styles.itemText}>
                                                {item.name}
                                            </ThemedText>
                                        </View>
                                        <View style={styles.timeInfo}>
                                            <View style={styles.timeIcon}>
                                                <ThemedText type="default" style={styles.iconText}>
                                                    ⌚
                                                </ThemedText>
                                            </View>
                                            <ThemedText type="caption" style={styles.itemTime}>
                                                {item.time}
                                            </ThemedText>
                                        </View>
                                    </View>
                                ))
                            )}
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
    header: {
        paddingTop: Typography.spacing['4xl'],
        paddingBottom: Typography.spacing['3xl'],
        paddingHorizontal: Typography.spacing.lg,
        alignItems: 'center',
    },
    headerTitle: {
        textAlign: 'center',
        fontFamily: 'LeagueSpartan-Black',
    },
    content: {
        flex: 1,
        paddingHorizontal: Typography.spacing.lg,
        paddingTop: Typography.spacing.sm,
    },
    card: {
        marginBottom: Typography.spacing.lg,
        minHeight: 160,
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
    secondInput: {
        marginTop: Typography.spacing.md,
    },
    addButton: {
        borderRadius: 16,
        paddingVertical: Typography.spacing.md,
        paddingHorizontal: Typography.spacing.xl,
        marginTop: Typography.spacing.lg,
        alignItems: 'center',
        width: '100%',
    },
    addButtonText: {
        color: Colors.dark.text,
        fontWeight: Typography.weights.semibold,
        fontSize: Typography.base.fontSize,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: Typography.spacing.md,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Typography.spacing.sm,
        paddingVertical: Typography.spacing.md,
        paddingHorizontal: Typography.spacing.lg,
        backgroundColor: 'rgba(30, 41, 59, 0.2)',
        borderRadius: 12,
        width: '100%',
    },
    medicineInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    medicineIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Typography.spacing.md,
    },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Typography.spacing.sm,
    },
    iconText: {
        fontSize: 16,
        fontWeight: Typography.weights.bold,
    },
    itemText: {
        flex: 1,
        fontWeight: Typography.weights.medium,
    },
    itemTime: {
        textAlign: 'right',
        fontWeight: Typography.weights.medium,
    },
});
    saveButtonDisabled: {
        opacity: 0.7,
    },
    addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    itemText: { color: '#222', fontSize: 16 },
    itemTime: { color: '#555', fontSize: 16 },
});
