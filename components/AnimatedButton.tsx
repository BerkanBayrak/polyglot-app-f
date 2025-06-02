// components/AnimatedButton.tsx
import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { createScaleAnimation } from '@/utils/animations';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'primary'
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    createScaleAnimation(scaleValue, 0.95, 100).start();
  };

  const handlePressOut = () => {
    createScaleAnimation(scaleValue, 1, 100).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#007AFF'
        };
      case 'success':
        return { backgroundColor: '#4CAF50' };
      case 'warning':
        return { backgroundColor: '#FF9800' };
      case 'danger':
        return { backgroundColor: '#F44336' };
      default:
        return { backgroundColor: '#007AFF' };
    }
  };

  const getTextVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { color: '#007AFF' };
      default:
        return { color: '#FFFFFF' };
    }
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.button,
          getVariantStyles(),
          {
            transform: [{ scale: scaleValue }],
            opacity: disabled ? 0.6 : 1
          },
          style
        ]}
      >
        <Text style={[styles.buttonText, getTextVariantStyles(), textStyle]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});