import { ScrollView, StyleSheet, View } from 'react-native';

import { DarkVeilBackground } from '@/components/dark-veil-background';
import { GlassCard } from '@/components/glass-card';
import { ThemedText } from '@/components/themed-text';
import { Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ConsultationsScreen() {
    const clinics = [
        { name: 'Luciano Med', specialty: 'Cardiology', emoji: '❤️' },
        { name: 'Test Med', specialty: 'Gynecology', emoji: '🩷' },
    ];

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
    },
});