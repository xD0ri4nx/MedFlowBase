import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ConsultationsScreen() {
    const clinics = [
        { name: 'Luciano Med', specialty: 'Cardiology', emoji: '❤️' },
        { name: 'Test Med', specialty: 'Gynecology', emoji: '🩷' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#ff4b5c', '#ff6f61']} style={styles.header}>
                <Text style={styles.headerTitle}>Clinics & Consultations</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                {clinics.map((clinic, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.clinicTitle}>
                            {clinic.emoji} {clinic.name}
                        </Text>
                        <Text style={styles.specialty}>{clinic.specialty}</Text>
                    </View>
                ))}
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
    clinicTitle: { fontSize: 20, color: '#b22222', fontWeight: '700' },
    specialty: { fontSize: 16, color: '#444', marginTop: 5 },
});
