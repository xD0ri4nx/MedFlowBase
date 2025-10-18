import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

interface StarFieldProps {
  density?: number; // Number of stars per screen area
  twinkleSpeed?: number; // Speed of twinkling animation
  style?: any;
}

export function StarField({ 
  density = 0.3, 
  twinkleSpeed = 2000, 
  style 
}: StarFieldProps) {
  const starColor = useThemeColor({}, 'starColor');
  const { width, height } = Dimensions.get('window');
  const animationRef = useRef<any>();

  // Generate random star positions
  const generateStars = () => {
    const stars = [];
    const numStars = Math.floor((width * height * density) / 10000);
    
    for (let i = 0; i < numStars; i++) {
      stars.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1, // 1-3px stars
        opacity: Math.random() * 0.8 + 0.2, // 0.2-1.0 opacity
        twinkleDelay: Math.random() * twinkleSpeed,
      });
    }
    return stars;
  };

  const [stars] = React.useState(generateStars);

  useEffect(() => {
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      {stars.map((star) => (
        <View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              backgroundColor: starColor,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    borderRadius: 50,
  },
});
