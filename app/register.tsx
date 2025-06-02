import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Theme';
import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import Checkbox from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, user, loading: authLoading } = useAuth();
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

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      router.replace('/language-selection');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
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

            <View style={{ flex: 1 }}>
              <Text style={layout.isWeb ? ResponsiveStyles.webTitle : {
                fontSize: layout.fontSize.xlarge,
                fontWeight: 'bold',
                color: Colors.text
              }}>
                Create Account
              </Text>

              <Text style={{
                fontSize: layout.fontSize.medium,
                color: '#666',
                marginTop: 4
              }}>
                Join PolyGlotPal and start learning!
              </Text>
            </View>
          </View>

          {/* Name Input */}
          <View style={layout.isWeb ? ResponsiveStyles.webFormGroup : { marginBottom: 20 }}>
            <Text style={layout.isWeb ? ResponsiveStyles.webLabel : {
              fontSize: layout.fontSize.medium,
              fontWeight: 'bold',
              color: Colors.text,
              marginBottom: 8
            }}>
              Full Name
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
                focusedInput === 'name' && (layout.isWeb ? ResponsiveStyles.webInputFocused : {
                  borderColor: Colors.primary
                })
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              autoCapitalize="words"
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Email Input */}
          <View style={layout.isWeb ? ResponsiveStyles.webFormGroup : { marginBottom: 20 }}>
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
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[
                  layout.isWeb ? ResponsiveStyles.webInput : {
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: layout.fontSize.medium,
                    paddingRight: 50
                  },
                  focusedInput === 'password' && (layout.isWeb ? ResponsiveStyles.webInputFocused : {
                    borderColor: Colors.primary
                  })
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a strong password"
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  padding: 4
                }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            <Text style={{
              fontSize: layout.fontSize.small,
              color: '#666',
              marginTop: 4
            }}>
              Must be at least 6 characters
            </Text>
          </View>

          {/* Confirm Password Input */}
          <View style={layout.isWeb ? ResponsiveStyles.webFormGroup : { marginBottom: 20 }}>
            <Text style={layout.isWeb ? ResponsiveStyles.webLabel : {
              fontSize: layout.fontSize.medium,
              fontWeight: 'bold',
              color: Colors.text,
              marginBottom: 8
            }}>
              Confirm Password
            </Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[
                  layout.isWeb ? ResponsiveStyles.webInput : {
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: layout.fontSize.medium,
                    paddingRight: 50
                  },
                  focusedInput === 'confirmPassword' && (layout.isWeb ? ResponsiveStyles.webInputFocused : {
                    borderColor: Colors.primary
                  })
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  padding: 4
                }}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms Agreement */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 32
          }}>
            <Checkbox
              style={{ marginRight: 12, marginTop: 2 }}
              value={agreeTerms}
              onValueChange={setAgreeTerms}
              color={Colors.primary}
            />
            <Text style={{
              fontSize: layout.fontSize.small,
              color: Colors.text,
              flex: 1,
              lineHeight: 20
            }}>
              I agree to the{' '}
              <Text style={{ color: Colors.primary, fontWeight: '600' }}>
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text style={{ color: Colors.primary, fontWeight: '600' }}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={layout.isWeb ? ResponsiveStyles.webButton : {
              backgroundColor: Colors.primary,
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 24
            }}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={layout.isWeb ? ResponsiveStyles.webButtonText : {
              color: '#fff',
              fontSize: layout.fontSize.medium,
              fontWeight: '600'
            }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <Text style={{
            textAlign: 'center',
            fontSize: layout.fontSize.small,
            color: '#666'
          }}>
            Already have an account?{' '}
            <Text
              style={{ color: Colors.primary, fontWeight: '600' }}
              onPress={() => router.replace('/login')}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}