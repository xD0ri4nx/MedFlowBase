import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { DarkVeilBackground } from '@/components/dark-veil-background';
import { GlassCard } from '@/components/glass-card';
import { StepIndicator } from '@/components/step-indicator';
import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SportScreen() {
    const [activity, setActivity] = useState<string | null>(null);
    const [steps, setSteps] = useState('');
    const [debouncedSteps, setDebouncedSteps] = useState('');

    // Debounce the steps input for better performance
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSteps(steps);
        }, 50); // Reduced to 50ms for faster response

        return () => clearTimeout(timer);
    }, [steps]);

    // Parse steps with debouncing for optimal performance
    const stepCount = useMemo(() => parseInt(debouncedSteps, 10) || 0, [debouncedSteps]);

    // Handle Enter key press - update immediately
    const handleSubmit = () => {
        setDebouncedSteps(steps); // Force immediate update
    };

    const levels = [
        { label: 'No Activity', value: 'none' },
        { label: 'Light', value: 'light' },
        { label: 'Medium', value: 'medium' },
        { label: 'Intense', value: 'intense' },
    ];

    const accentColor = useThemeColor({}, 'accent');
    const placeholderText = useThemeColor({}, 'placeholderText');

    // Handle step input with validation
    const handleStepChange = (text: string) => {
        // Allow only numbers and limit to reasonable step count
        const value = text.replace(/[^0-9]/g, '').slice(0, 6); // Max 6 digits for steps
        const numValue = parseInt(value, 10);
        if (value === '' || (numValue >= 0 && numValue <= 100000)) { // Max 100k steps
            setSteps(value);
        }
    };

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
                        Sport Tracker
                    </ThemedText>
                </View>

                {/* Content Cards */}
                <View style={styles.content}>
                    {/* Activity Level Card */}
                    <GlassCard style={styles.card} noShadow={true}>
                        <View style={styles.cardContent}>
                            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: accentColor }]}>
                                Activity Level
                            </ThemedText>
                            <View style={styles.levelContainer}>
                                {levels.map((lvl) => (
                                    <TouchableOpacity
                                        key={lvl.value}
                                        style={[
                                            styles.levelButton,
                                            activity === lvl.value && [styles.levelActive, { backgroundColor: accentColor }],
                                        ]}
                                        onPress={() => setActivity(lvl.value)}
                                    >
                                        <ThemedText
                                            type="default"
                                            style={[
                                                styles.levelText,
                                                activity === lvl.value && styles.levelTextActive,
                                            ]}
                                        >
                                            {lvl.label}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </GlassCard>

                    {/* Steps Card */}
                    <GlassCard style={styles.card} noShadow={true}>
                        <View style={styles.cardContent}>
                            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: accentColor }]}>
                                Steps Today
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
                                placeholder="Enter the number of steps you took today"
                                placeholderTextColor={placeholderText}
                                keyboardType="numeric"
                                value={steps}
                                onChangeText={handleStepChange}
                                onSubmitEditing={handleSubmit}
                                returnKeyType="done"
                                autoComplete="off"
                                autoCorrect={false}
                                autoCapitalize="none"
                                selectTextOnFocus={true}
                            />
                        </View>
                    </GlassCard>

                    {/* Step Activity Indicator Card */}
                    <GlassCard style={styles.card} noShadow={true}>
                        <View style={styles.cardContent}>
                            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: accentColor }]}>
                                Your Activity Level:
                            </ThemedText>
                            <StepIndicator steps={stepCount} size="large" />
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
    levelContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Typography.spacing.sm,
        width: '100%',
    },
    levelButton: {
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
        borderRadius: 16,
        paddingVertical: Typography.spacing.md,
        paddingHorizontal: Typography.spacing.lg,
        backgroundColor: 'rgba(30, 41, 59, 0.3)',
        minWidth: 80,
        alignItems: 'center',
    },
    levelActive: {
        borderColor: Colors.dark.accent,
    },
    levelText: {
        fontSize: Typography.sm.fontSize,
        textAlign: 'center',
    },
    levelTextActive: {
        color: Colors.dark.text,
        fontWeight: Typography.weights.semibold,
    },
});