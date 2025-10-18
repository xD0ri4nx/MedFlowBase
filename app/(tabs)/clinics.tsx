import { ScrollView, StyleSheet, View } from 'react-native';

import { DarkVeilBackground } from '@/components/dark-veil-background';
import { GlassCard } from '@/components/glass-card';
import { ThemedText } from '@/components/themed-text';
import { Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
// app/(tabs)/clinics.tsx
import { createClient } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in environment variables');
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

interface Clinic {
    id: string;
    name: string;
    specialty: string;
    emoji: string;
    address?: string;
    phone?: string;
    email?: string;
    [key: string]: any; // Allow any additional fields from database
}

export default function ClinicsScreen() {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchClinics();
    }, []);

    const fetchClinics = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const { data, error } = await supabase
                .from('cabinete')
                .select('*')
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching clinics:', error);
                setError('Could not load clinics');
                Alert.alert('Error', 'Could not load clinics');
                return;
            }

            setClinics(data || []);
            console.log('Success: Clinics loaded successfully');
            console.log('Number of clinics:', data?.length || 0);
        } catch (err: unknown) {
            console.error('Error fetching clinics:', err);
            setError('Could not load clinics');
            Alert.alert('Error', 'Could not load clinics');
        } finally {
            setLoading(false);
        }
    };

    const handleClinicPress = (clinicId: string) => {
        console.log('Navigating to clinic:', clinicId);
        // Navigate to dynamic clinic page
        router.push(`/clinic/${clinicId}` as any);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
                    <Text style={styles.headerTitle}>Clinics & Consultations</Text>
                </LinearGradient>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ff4b5c" />
                    <Text style={styles.loadingText}>Loading clinics...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
                    <Text style={styles.headerTitle}>Clinics & Consultations</Text>
                </LinearGradient>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchClinics}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const accentColor = useThemeColor({}, 'accent');

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
                        Clinics & Consultations
                    </ThemedText>
                </View>

                {/* Content Cards */}
                <View style={styles.content}>
                    {clinics.map((clinic, index) => (
                        <GlassCard key={index} style={styles.card}>
                            <View style={styles.cardContent}>
                                <ThemedText type="subtitle" style={[styles.clinicTitle, { color: accentColor }]}>
                                    {clinic.emoji} {clinic.name}
                                </ThemedText>
                                <ThemedText type="default" style={styles.specialty}>
                                    {clinic.specialty}
                                </ThemedText>
                            </View>
                        </GlassCard>
                    ))}
                </View>
            </ScrollView>
        </DarkVeilBackground>
        <ScrollView style={styles.container}>
            <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
                <Text style={styles.headerTitle}>Clinics & Consultations</Text>
                <Text style={styles.headerSubtitle}>
                    {clinics.length} {clinics.length === 1 ? 'clinic' : 'clinics'} available
                </Text>
            </LinearGradient>

            <View style={styles.content}>
                {clinics.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>🏥</Text>
                        <Text style={styles.emptyText}>No clinics found</Text>
                        <Text style={styles.emptySubtext}>Check back later for available clinics</Text>
                    </View>
                ) : (
                    clinics.map((clinic) => (
                        <TouchableOpacity
                            key={clinic.id}
                            style={styles.card}
                            onPress={() => handleClinicPress(clinic.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.cardContent}>
                                <Text style={styles.emoji}>{clinic.emoji || '🏥'}</Text>
                                <View style={styles.clinicInfo}>
                                    <Text style={styles.clinicTitle}>{clinic.name}</Text>
                                    <Text style={styles.specialty}>{clinic.specialty}</Text>
                                    {clinic.address && (
                                        <Text style={styles.address} numberOfLines={1}>
                                            📍 {clinic.address}
                                        </Text>
                                    )}
                                </View>
                                <Text style={styles.arrow}>›</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
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
    clinicTitle: {
        textAlign: 'center',
        marginBottom: Typography.spacing.sm,
    },
    specialty: {
        textAlign: 'center',
        opacity: 0.8,
    headerTitle: { 
        color: '#fff', 
        fontSize: 24, 
        fontWeight: 'bold' 
    },
    headerSubtitle: { 
        color: '#fff', 
        fontSize: 14, 
        marginTop: 5, 
        opacity: 0.9 
    },
    content: { 
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 36,
        marginRight: 15,
    },
    clinicInfo: {
        flex: 1,
    },
    clinicTitle: { 
        fontSize: 20, 
        color: '#b22222', 
        fontWeight: '700',
        marginBottom: 4,
    },
    specialty: { 
        fontSize: 16, 
        color: '#444',
        marginBottom: 4,
    },
    address: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    arrow: {
        fontSize: 32,
        color: '#ff4b5c',
        fontWeight: '300',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    errorText: {
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#ff4b5c',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        fontWeight: '600',
        marginBottom: 5,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#bbb',
    },
});