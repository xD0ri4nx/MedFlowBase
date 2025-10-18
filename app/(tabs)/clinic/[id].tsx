// app/(tabs)/clinic/[id].tsx
// This file should be placed at: app/(tabs)/clinic/[id].tsx
// It will be accessible but NOT shown in the tab bar navigation
import { createClient } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

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
    description?: string;
    working_hours?: string;
    [key: string]: any; // Allow any additional fields from database
}

export default function ClinicDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            fetchClinicDetails();
        }
    }, [id]);

    const fetchClinicDetails = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('cabinete')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching clinic details:', error);
                Alert.alert('Error', 'Could not load clinic details');
                return;
            }

            setClinic(data);
            console.log('Success: Clinic details loaded');
        } catch (err: unknown) {
            console.error('Error fetching clinic details:', err);
            Alert.alert('Error', 'Could not load clinic details');
        } finally {
            setLoading(false);
        }
    };

    const handleCall = () => {
        if (clinic?.phone) {
            Linking.openURL(`tel:${clinic.phone}`);
        }
    };

    const handleEmail = () => {
        if (clinic?.email) {
            Linking.openURL(`mailto:${clinic.email}`);
        }
    };

    const handleDirections = () => {
        if (clinic?.address) {
            const address = encodeURIComponent(clinic.address);
            Linking.openURL(`https://maps.google.com/?q=${address}`);
        }
    };

    const handleGoBack = () => {
        // Navigate back to clinics tab
        router.push('/(tabs)/clinics' as any);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ff4b5c" />
                    <Text style={styles.loadingText}>Loading clinic details...</Text>
                </View>
            </View>
        );
    }

    if (!clinic) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ Clinic not found</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
                        <Text style={styles.retryButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.emoji}>{clinic.emoji || '🏥'}</Text>
                <Text style={styles.headerTitle}>{clinic.name}</Text>
                <Text style={styles.headerSubtitle}>{clinic.specialty}</Text>
            </LinearGradient>

            <View style={styles.content}>
                {clinic.description && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.description}>{clinic.description}</Text>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    
                    {clinic.phone && (
                        <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                            <Text style={styles.contactIcon}>📞</Text>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Phone</Text>
                                <Text style={styles.contactValue}>{clinic.phone}</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {clinic.email && (
                        <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                            <Text style={styles.contactIcon}>✉️</Text>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Email</Text>
                                <Text style={styles.contactValue}>{clinic.email}</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {clinic.address && (
                        <TouchableOpacity style={styles.contactItem} onPress={handleDirections}>
                            <Text style={styles.contactIcon}>📍</Text>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Address</Text>
                                <Text style={styles.contactValue}>{clinic.address}</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {clinic.working_hours && (
                        <View style={styles.contactItem}>
                            <Text style={styles.contactIcon}>🕐</Text>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Working Hours</Text>
                                <Text style={styles.contactValue}>{clinic.working_hours}</Text>
                            </View>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Consultation</Text>
                </TouchableOpacity>
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
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        padding: 10,
        zIndex: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '600',
    },
    emoji: {
        fontSize: 64,
        marginBottom: 10,
    },
    headerTitle: { 
        color: '#fff', 
        fontSize: 28, 
        fontWeight: 'bold',
        marginBottom: 5,
    },
    headerSubtitle: { 
        color: '#fff', 
        fontSize: 18, 
        opacity: 0.9,
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#b22222',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contactIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    bookButton: {
        backgroundColor: '#ff4b5c',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 10,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
});