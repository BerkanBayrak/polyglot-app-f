import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Theme';
import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import Checkbox from 'expo-checkbox';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const { login, user, loading: authLoading } = useAuth();
  const layout = useResponsiveLayout();

  // Eğer kullanıcı zaten giriş yapmışsa yönlendir
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/(tabs)/mainscreen');
    }
  }, [user, authLoading]);

  // Auth loading state
  if (authLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{
          marginTop: 16,
          fontSize: 16,
          color: '#666'
        }}>
          Loading...
        </Text>
      </View>
    );
  }

  // Eğer user varsa boş return (redirect edilecek)
  if (user) {
    return null;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/language-selection');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert('Success', 'Password reset email sent!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const containerStyle = layout.isWeb ?
    ResponsiveStyles.webContainer :
    { flex: 1, backgroundColor: '#f5f5f5' };

  const cardStyle = layout.isWeb ?
    ResponsiveStyles.webCard :
    { flex: 1, backgroundColor: '#fff', margin: 20, borderRadius: 12, padding: 20 };

  return (
    <View style={containerStyle}>
      <ScrollView
        contentContainerStyle={layout.isWeb ? {} : { flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyle}>
          {/* Header */}
          <Text style={layout.isWeb ? ResponsiveStyles.webTitle : {
            textAlign: 'center',
            fontSize: layout.fontSize.xlarge,
            fontWeight: 'bold',
            color: Colors.text,
            marginBottom: 8
          }}>
            Welcome Back
          </Text>

          <Text style={layout.isWeb ? ResponsiveStyles.webSubtitle : {
            textAlign: 'center',
            fontSize: layout.fontSize.medium,
            color: '#666',
            marginBottom: 32
          }}>
            Sign in to continue learning
          </Text>

          {/* Email Input */}
          <View style={layout.isWeb ? ResponsiveStyles.webFormGroup : { marginBottom: 20 }}>
            <Text style={layout.isWeb ? ResponsiveStyles.webLabel : {
              fontSize: layout.fontSize.medium,
              fontWeight: 'bold',
              color: Colors.text,
              marginBottom: 8
            }}>
              Email
            </Text>
            <TextInput
              style={[
                layout.isWeb ? ResponsiveStyles.webInput : {
                  borderWidth: 1,
                  borderColor: '#ddd',
                  padding: 12,
                  borderRadius: 8,
                  fontSize: layout.fontSize.medium
                },
                focusedInput === 'email' && (layout.isWeb ? ResponsiveStyles.webInputFocused : {
                  borderColor: Colors.primary
                })
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Password Input */}
          <View style={layout.isWeb ? ResponsiveStyles.webFormGroup : { marginBottom: 20 }}>
            <Text style={layout.isWeb ? ResponsiveStyles.webLabel : {
              fontSize: layout.fontSize.medium,
              fontWeight: 'bold',
              color: Colors.text,
              marginBottom: 8
            }}>
              Password
            </Text>
            <TextInput
              style={[
                layout.isWeb ? ResponsiveStyles.webInput : {
                  borderWidth: 1,
                  borderColor: '#ddd',
                  padding: 12,
                  borderRadius: 8,
                  fontSize: layout.fontSize.medium
                },
                focusedInput === 'password' && (layout.isWeb ? ResponsiveStyles.webInputFocused : {
                  borderColor: Colors.primary
                })
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={{
            flexDirection: layout.isWeb ? 'row' : 'column',
            justifyContent: 'space-between',
            alignItems: layout.isWeb ? 'center' : 'flex-start',
            marginBottom: 32,
            gap: layout.isWeb ? 0 : 16
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                style={{ marginRight: 8 }}
                value={rememberMe}
                onValueChange={setRememberMe}
                color={Colors.primary}
              />
              <Text style={{ fontSize: layout.fontSize.small, color: Colors.text }}>
                Remember me
              </Text>
            </View>

            <TouchableOpacity>
              <Text style={{
                fontSize: layout.fontSize.small,
                color: Colors.primary,
                fontWeight: '600'
              }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={layout.isWeb ? ResponsiveStyles.webButton : {
              backgroundColor: Colors.primary,
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 24
            }}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={layout.isWeb ? ResponsiveStyles.webButtonText : {
              color: '#fff',
              fontSize: layout.fontSize.medium,
              fontWeight: '600'
            }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <Text style={{
            textAlign: 'center',
            fontSize: layout.fontSize.small,
            color: '#666'
          }}>
            Don't have an account?{' '}
            <Text
              style={{ color: Colors.primary, fontWeight: '600' }}
              onPress={() => router.replace('/register')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
