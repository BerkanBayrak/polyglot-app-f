import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Theme';
import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();
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

  // Eğer user varsa boş return
  if (user) {
    return null;
  }

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // AuthContext'ten resetPassword fonksiyonunu kullan
      // const { resetPassword } = useAuth();
      // await resetPassword(email);

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
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
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                padding: 8,
                marginRight: 16,
                borderRadius: 8,
                backgroundColor: '#f8f9fa'
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={layout.isWeb ? ResponsiveStyles.webTitle : {
              fontSize: layout.fontSize.xlarge,
              fontWeight: 'bold',
              color: Colors.text
            }}>
              Reset Password
            </Text>
          </View>

          {!emailSent ? (
            <>
              {/* Icon */}
              <View style={{
                alignItems: 'center',
                marginBottom: 30
              }}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: Colors.primary + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  <Ionicons name="mail-outline" size={40} color={Colors.primary} />
                </View>

                <Text style={{
                  fontSize: layout.fontSize.medium,
                  color: '#666',
                  textAlign: 'center',
                  lineHeight: 24
                }}>
                  Enter your email address and we'll send you a link to reset your password.
                </Text>
              </View>

              {/* Email Input */}
              <View style={layout.isWeb ? ResponsiveStyles.webFormGroup : { marginBottom: 24 }}>
                <Text style={layout.isWeb ? ResponsiveStyles.webLabel : {
                  fontSize: layout.fontSize.medium,
                  fontWeight: 'bold',
                  color: Colors.text,
                  marginBottom: 8
                }}>
                  Email Address
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
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              {/* Send Reset Email Button */}
              <TouchableOpacity
                style={layout.isWeb ? ResponsiveStyles.webButton : {
                  backgroundColor: Colors.primary,
                  padding: 16,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginBottom: 24
                }}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                <Text style={layout.isWeb ? ResponsiveStyles.webButtonText : {
                  color: '#fff',
                  fontSize: layout.fontSize.medium,
                  fontWeight: '600'
                }}>
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            /* Success State */
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#4caf50' + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24
              }}>
                <Ionicons name="checkmark-circle" size={40} color="#4caf50" />
              </View>

              <Text style={{
                fontSize: layout.fontSize.large,
                fontWeight: '600',
                color: Colors.text,
                textAlign: 'center',
                marginBottom: 16
              }}>
                Check Your Email
              </Text>

              <Text style={{
                fontSize: layout.fontSize.medium,
                color: '#666',
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 32
              }}>
                We've sent a password reset link to{'\n'}
                <Text style={{ fontWeight: '600', color: Colors.primary }}>
                  {email}
                </Text>
              </Text>

              <TouchableOpacity
                style={layout.isWeb ? ResponsiveStyles.webButton : {
                  backgroundColor: Colors.primary,
                  padding: 16,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginBottom: 16
                }}
                onPress={() => router.push('/login')}
              >
                <Text style={layout.isWeb ? ResponsiveStyles.webButtonText : {
                  color: '#fff',
                  fontSize: layout.fontSize.medium,
                  fontWeight: '600'
                }}>
                  Back to Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
              >
                <Text style={{
                  fontSize: layout.fontSize.small,
                  color: Colors.primary,
                  fontWeight: '600'
                }}>
                  Didn't receive email? Try again
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Back to Login Link */}
          {!emailSent && (
            <Text style={{
              textAlign: 'center',
              fontSize: layout.fontSize.small,
              color: '#666'
            }}>
              Remember your password?{' '}
              <Text
                style={{ color: Colors.primary, fontWeight: '600' }}
                onPress={() => router.push('/login')}
              >
                Back to Login
              </Text>
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}