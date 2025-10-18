// app/(tabs)/clinic/[id].tsx
// This file should be placed at: app/(tabs)/clinic/[id].tsx
// It will be accessible but NOT shown in the tab bar navigation
import { createClient } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        appointmentDate: '',
    });
    const [bookingLoading, setBookingLoading] = useState(false);
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

    const handleBookConsultation = async () => {
        // Validate input
        if (!bookingData.appointmentDate.trim()) {
            Alert.alert('Error', 'Please select a date');
            return;
        }

        // Validate clinic data
        if (!clinic?.id) {
            Alert.alert('Error', 'Clinic data not loaded');
            return;
        }

        // Log the entered date
        console.log('Entered appointment date:', bookingData.appointmentDate);

        // Check if the date is in the future
        const enteredDate = new Date(bookingData.appointmentDate);
        const currentDate = new Date('2025-10-18T14:07:00Z'); // 05:07 PM EEST, October 18, 2025
        if (enteredDate <= currentDate) {
            Alert.alert('Error', 'Please select a date in the future');
            return;
        }

        try {
            setBookingLoading(true);
            
            const fullDateTime = `${bookingData.appointmentDate}T00:00:00Z`; // Default to midnight UTC
            if (isNaN(Date.parse(fullDateTime))) {
                Alert.alert('Error', 'Invalid date format');
                return;
            }

            const { data, error } = await supabase
                .from('programari')
                .insert([
                    {
                        cabinet_id: clinic.id,   // Dynamically loaded from Supabase
                        data: fullDateTime,      // Store only the date
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Error booking consultation:', error);
                Alert.alert('Error', 'Could not book consultation. Please try again.');
                return;
            }

            console.log('Success: Consultation booked');
            Alert.alert(
                'Success! 🎉',
                `Your consultation at ${clinic.name} has been booked for ${bookingData.appointmentDate}`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setShowBookingModal(false);
                            setBookingData({
                                appointmentDate: '',
                            });
                        }
                    }
                ]
            );
        } catch (err: unknown) {
            console.error('Error booking consultation:', err);
            Alert.alert('Error', 'Could not book consultation. Please try again.');
        } finally {
            setBookingLoading(false);
        }
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

                <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => setShowBookingModal(true)}
                >
                    <Text style={styles.bookButtonText}>Book Consultation</Text>
                </TouchableOpacity>
            </View>

            {/* Booking Modal */}
            <Modal
                visible={showBookingModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowBookingModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Book Consultation</Text>
                                <TouchableOpacity 
                                    onPress={() => setShowBookingModal(false)}
                                    style={styles.closeButton}
                                >
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalClinicInfo}>
                                <Text style={styles.modalClinicEmoji}>{clinic?.emoji || '🏥'}</Text>
                                <Text style={styles.modalClinicName}>{clinic?.name}</Text>
                                <Text style={styles.modalClinicSpecialty}>{clinic?.specialty}</Text>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Appointment Date *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY-MM-DD (e.g., 2025-10-20)"
                                    value={bookingData.appointmentDate}
                                    onChangeText={(text) => setBookingData({...bookingData, appointmentDate: text})}
                                />
                            </View>

                            <TouchableOpacity 
                                style={[styles.submitButton, bookingLoading && styles.submitButtonDisabled]}
                                onPress={handleBookConsultation}
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Confirm Booking</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={() => setShowBookingModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#b22222',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 28,
        color: '#999',
        fontWeight: '300',
    },
    modalClinicInfo: {
        alignItems: 'center',
        marginBottom: 25,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalClinicEmoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    modalClinicName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    modalClinicSpecialty: {
        fontSize: 16,
        color: '#666',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#ff4b5c',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});