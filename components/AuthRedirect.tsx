// components/AuthRedirect.tsx
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';

export function AuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (loading || !navigationState?.key) return;

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
  }, [user, loading, segments, navigationState?.key]);

  return null;
}