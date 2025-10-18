import { useThemeColor } from '@/hooks/use-theme-color';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface StepIndicatorProps {
  steps: number;
  size?: 'small' | 'medium' | 'large';
}

export const StepIndicator = memo(function StepIndicator({ steps, size = 'medium' }: StepIndicatorProps) {
  const accentColor = useThemeColor({}, 'accent');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

  // Memoize the step status calculation to prevent unnecessary recalculations
  const status = useMemo(() => {
    if (isNaN(steps) || steps === 0) {
      return {
        color: accentColor,
        message: 'Enter your steps to see your activity level',
        circles: 0,
        status: 'Unknown',
      };
    } else if (steps < 2000) {
      return {
        color: errorColor,
        message: 'Very low activity - Try to move more throughout the day',
        circles: 1,
        status: 'Very Low',
      };
    } else if (steps >= 2000 && steps < 5000) {
      return {
        color: warningColor,
        message: 'Low activity - Consider taking more steps for better health',
        circles: 2,
        status: 'Low',
      };
    } else if (steps >= 5000 && steps < 8000) {
      return {
        color: warningColor,
        message: 'Moderate activity - Good start, aim for more steps',
        circles: 3,
        status: 'Moderate',
      };
    } else if (steps >= 8000 && steps <= 12000) {
      return {
        color: successColor,
        message: 'Excellent! You\'re getting optimal daily activity',
        circles: 4,
        status: 'Optimal',
      };
    } else if (steps > 12000) {
      return {
        color: successColor,
        message: 'Outstanding! You\'re very active today',
        circles: 4,
        status: 'High',
      };
    } else {
      return {
        color: accentColor,
        message: 'Enter your steps to see your activity level',
        circles: 0,
        status: 'Unknown',
      };
    }
  }, [steps, accentColor, successColor, warningColor, errorColor]);

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
    paddingVertical: 8,
  },
  circlesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  circle: {
    borderRadius: 50,
    borderWidth: 2,
  },
  messageContainer: {
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  messageText: {
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});
