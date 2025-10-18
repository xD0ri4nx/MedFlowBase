import { useThemeColor } from '@/hooks/use-theme-color';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface SleepIndicatorProps {
  hours: number;
  size?: 'small' | 'medium' | 'large';
}

export const SleepIndicator = memo(function SleepIndicator({ hours, size = 'medium' }: SleepIndicatorProps) {
  const accentColor = useThemeColor({}, 'accent');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

  // Memoize the sleep status calculation to prevent unnecessary recalculations
  const status = useMemo(() => {
    if (isNaN(hours) || hours === 0) {
      return {
        color: accentColor,
        message: 'Enter your sleep hours to see your quality',
        circles: 0,
        status: 'Unknown',
      };
    } else if (hours < 4) {
      return {
        color: errorColor,
        message: 'Not good - You need more sleep for better health',
        circles: 1,
        status: 'Poor',
      };
    } else if (hours >= 4 && hours <= 6) {
      return {
        color: warningColor,
        message: 'OK - Consider getting more sleep for optimal health',
        circles: 2,
        status: 'Fair',
      };
    } else if (hours >= 7 && hours <= 7) {
      return {
        color: successColor,
        message: 'Good! You\'re getting adequate sleep',
        circles: 3,
        status: 'Good',
      };
    } else if (hours >= 8 && hours <= 9) {
      return {
        color: successColor,
        message: 'Excellent! You\'re getting optimal sleep for your health',
        circles: 4,
        status: 'Optimal',
      };
    } else if (hours >= 10 && hours <= 11) {
      return {
        color: warningColor,
        message: 'Good sleep, but consider if you need this much',
        circles: 3,
        status: 'Long',
      };
    } else if (hours >= 12) {
      return {
        color: errorColor,
        message: 'Something is not alright - Too much sleep can be unhealthy',
        circles: 1,
        status: 'Excessive',
      };
    } else {
      return {
        color: accentColor,
        message: 'Enter your sleep hours to see your quality',
        circles: 0,
        status: 'Unknown',
      };
    }
  }, [hours, accentColor, successColor, warningColor, errorColor]);

  const sizeStyles = getSizeStyles(size);

  return (
    <View style={styles.container}>
      <View style={styles.circlesContainer}>
        {[1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.circle,
              sizeStyles.circle,
              {
                backgroundColor: index <= status.circles ? status.color : 'transparent',
                borderColor: status.color,
              },
            ]}
          />
        ))}
      </View>
      
      <View style={styles.messageContainer}>
        <ThemedText type="subtitle" style={[styles.statusText, { color: status.color }]}>
          {status.status}
        </ThemedText>
        <ThemedText type="caption" style={styles.messageText}>
          {status.message}
        </ThemedText>
      </View>
    </View>
  );
});

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return {
        circle: { width: 12, height: 12 },
      };
    case 'large':
      return {
        circle: { width: 20, height: 20 },
      };
    default:
      return {
        circle: { width: 16, height: 16 },
      };
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8, // Reduced padding to fix margin issue
  },
  circlesContainer: {
    flexDirection: 'row',
    marginBottom: 16, // Reduced margin
    gap: 8,
  },
  circle: {
    borderRadius: 50,
    borderWidth: 2,
  },
  messageContainer: {
    alignItems: 'center',
    gap: 6, // Reduced gap
  },
  statusText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  messageText: {
    textAlign: 'center',
    lineHeight: 18, // Reduced line height
    paddingHorizontal: 16,
  },
});