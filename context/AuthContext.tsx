
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface User {
  email: string;
  uid?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Component mount olduğunda user state'ini kontrol et
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Web'de başlangıçta loading süresini kısalt
        const delay = Platform.OS === 'web' ? 500 : 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Real app'te burada stored auth token check edilir
        // localStorage.getItem('authToken') gibi

        // Şimdilik user yok olarak başla
        setUser(null);

      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful login - replace with real API
      if (email && password) {
        const newUser = { email };
        setUser(newUser);

        // Real app'te burada token'ı storage'a kaydet
        // localStorage.setItem('authToken', 'token_here');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful registration
      if (email && password && name) {
        const newUser = { email, name };
        setUser(newUser);

        // Real app'te burada token'ı storage'a kaydet
        // localStorage.setItem('authToken', 'token_here');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);

      // Real app'te burada token'ı storage'dan sil
      // localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}