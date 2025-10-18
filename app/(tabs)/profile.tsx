import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Profile {
    id: string;
    full_name: string;
    date_of_birth: string;
    phone: string;
    created_at: string;
    updated_at: string;
}

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                setProfile(data);
                setFullName(data.full_name || '');
                setDateOfBirth(data.date_of_birth || '');
                setPhone(data.phone || '');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const profileData = {
                id: user.id,
                full_name: fullName,
                date_of_birth: dateOfBirth,
                phone: phone,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(profileData, { onConflict: 'id' });

            if (error) throw error;

            Alert.alert('Success', 'Profile updated successfully');
            loadProfile();
        } catch (error: any) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', error.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            router.replace('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Failed to sign out');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </LinearGradient>

            <View style={styles.content}>
                <ThemedView style={styles.card}>
                    <ThemedText type="subtitle" style={{ color: '#b22222' }}>
                        User Information
                    </ThemedText>

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={user?.email || ''}
                        editable={false}
                    />

                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <Text style={styles.label}>Date of Birth</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
                    />

                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your phone number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <TouchableOpacity
                        style={[styles.button, saving && styles.buttonDisabled]}
                        onPress={saveProfile}
                        disabled={saving}
                    >
                        <Text style={styles.buttonText}>
                            {saving ? 'Saving...' : 'Save Profile'}
                        </Text>
                    </TouchableOpacity>
                </ThemedView>

                <ThemedView style={styles.card}>
                    <ThemedText type="subtitle" style={{ color: '#b22222', marginBottom: 15 }}>
                        Account Actions
                    </ThemedText>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </ThemedView>

                {profile && (
                    <ThemedView style={styles.card}>
                        <ThemedText type="subtitle" style={{ color: '#b22222' }}>
                            Profile Details
                        </ThemedText>
                        <Text style={styles.profileText}>Member since: {new Date(profile.created_at).toLocaleDateString()}</Text>
                        {profile.updated_at && (
                            <Text style={styles.profileText}>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</Text>
                        )}
                    </ThemedView>
                )}
            </View>
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
    headerTitle: {
        color: 'white',
        fontSize: 26,
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
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 15,
        marginBottom: 5,
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
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#666',
    },
    button: {
        backgroundColor: '#ff4b5c',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#ff4757',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    profileText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});