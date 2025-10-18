import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

interface DarkVeilBackgroundProps {
  children?: React.ReactNode;
  style?: any;
}

export function DarkVeilBackground({ children, style }: DarkVeilBackgroundProps) {
  const { width, height } = Dimensions.get('window');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const particleAnimations = useRef<Animated.Value[]>([]).current;

  // Create animated particles
  const createParticles = () => {
    const particles = [];
    const numParticles = 15;
    
    for (let i = 0; i < numParticles; i++) {
      const animValue = new Animated.Value(Math.random());
      particleAnimations.push(animValue);
      
      particles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        animation: animValue,
      });
    }
    return particles;
  };

  const [particles] = React.useState(createParticles);

  useEffect(() => {
    // Main background animation
    const mainAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    );

    // Particle animations
    const particleAnimationsLoop = particleAnimations.map((animValue) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: Math.random() * 3000 + 2000,
            useNativeDriver: false,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: Math.random() * 3000 + 2000,
            useNativeDriver: false,
          }),
        ])
      )
    );

    mainAnimation.start();
    particleAnimationsLoop.forEach(anim => anim.start());

    return () => {
      mainAnimation.stop();
      particleAnimationsLoop.forEach(anim => anim.stop());
    };
  }, []);

  const gradientStart = useThemeColor({}, 'gradientStart');
  const gradientEnd = useThemeColor({}, 'gradientEnd');
  const starColor = useThemeColor({}, 'starColor');

  const animatedGradientColors = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [gradientStart, gradientEnd],
  });

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      {/* Base gradient */}
      <LinearGradient
        colors={[gradientStart, gradientEnd, '#0a0e1a']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Animated overlay */}
      <Animated.View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[gradientEnd, gradientStart, '#1a1f2e']}
          style={StyleSheet.absoluteFill}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* Floating particles */}
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: starColor,
              opacity: particle.opacity,
              transform: [
                {
                  scale: particle.animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
                {
                  translateY: particle.animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {/* Subtle noise texture overlay */}
      <View style={styles.noiseOverlay} />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    opacity: 0.3,
  },
});
