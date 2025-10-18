import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async () => {
        setSubmitting(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            console.log('Login successful, redirecting...');
        } catch (err: any) {
            Alert.alert('Login failed', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>MedFlow</Text>
                <Text style={styles.subtitle}>Welcome back 👋</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={submitting || loading}>
                    <Text style={styles.buttonText}>{submitting ? 'Loading...' : 'Login'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.link}>Don&apos;t have an account? Register</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    title: { fontSize: 32, fontWeight: 'bold', color: '#ff4b5c' },
    subtitle: { fontSize: 18, color: '#444', marginVertical: 8 },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginTop: 12,
        color: '#222',
    },
    button: {
        backgroundColor: '#ff4b5c',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 50,
        marginTop: 20,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    link: { color: '#ff4b5c', marginTop: 15 },
});
