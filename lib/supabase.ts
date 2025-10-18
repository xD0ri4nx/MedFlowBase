import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

console.log('Environment variables available:');
console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL ? '✓ Present' : '✗ Missing');
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '✓ Present' : '✗ Missing');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables:');
    console.error('URL:', SUPABASE_URL);
    console.error('Key present:', !!SUPABASE_ANON_KEY);

    throw new Error(
        'Missing Supabase environment variables. Please check your .env file.'
    );
}

const createSafeStorage = () => {
    if (typeof window === 'undefined') {
        return {
            getItem: async (key: string) => {
                console.log('Mock getItem called for:', key);
                return null;
            },
            setItem: async (key: string, value: string) => {
                console.log('Mock setItem called for:', key);
            },
            removeItem: async (key: string) => {
                console.log('Mock removeItem called for:', key);
            },
        };
    }

    return AsyncStorage;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: createSafeStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
    },
});