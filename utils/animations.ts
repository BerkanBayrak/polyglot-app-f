// utils/animations.ts
import { Animated, Easing } from 'react-native';

export const createFadeInAnimation = (animatedValue: Animated.Value, duration: number = 300) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

export const createSlideInAnimation = (animatedValue: Animated.Value, duration: number = 400) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};

export const createScaleAnimation = (animatedValue: Animated.Value, toValue: number = 1, duration: number = 200) => {
  return Animated.spring(animatedValue, {
    toValue,
    friction: 8,
    tension: 40,
    useNativeDriver: true,
  });
};

export const createPulseAnimation = (animatedValue: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

export const createShakeAnimation = (animatedValue: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
    Animated.timing(animatedValue, { toValue: -10, duration: 100, useNativeDriver: true }),
    Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
    Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
  ]);
};