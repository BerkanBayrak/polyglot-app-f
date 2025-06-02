// components/AuthGuard.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSegments } from 'expo-router';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const layout = useResponsiveLayout();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inPublicRoutes = ['login', 'register', 'index'].includes(segments[0] || '');
    const inLanguageSelection = segments[0] === 'language-selection';

    if (!user && (inAuthGroup || inLanguageSelection)) {
      // Kullanıcı giriş yapmamış ama protected route'a gitmek istiyor
      router.replace('/');
    } else if (user && inPublicRoutes && segments[0] !== 'language-selection') {
      // Kullanıcı giriş yapmış ama hala public route'da
      router.replace('/(tabs)/mainscreen');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: layout.spacing.large
      }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{
          marginTop: layout.spacing.medium,
          fontSize: layout.fontSize.medium,
          color: '#666',
          textAlign: 'center'
        }}>
          Loading...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}