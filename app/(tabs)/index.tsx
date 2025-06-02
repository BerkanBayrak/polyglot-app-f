import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, GlobalStyles } from '@/constants/Theme';
import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export default function WelcomeScreen() {
  const router = useRouter();
  const layout = useResponsiveLayout();
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Component mount tracking
  useEffect(() => {
    setIsMounted(true);
  }, []);



  const containerStyle = layout.isWeb ?
    ResponsiveStyles.webContainer :
    GlobalStyles.container;

  const cardStyle = layout.isWeb ?
    { ...ResponsiveStyles.webCard, minHeight: '90vh' } :
    { flex: 1, padding: 20 };

  return (
    <View style={containerStyle}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingVertical: layout.isWeb ? 40 : 20
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyle}>
          {/* Logo and Title */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={layout.isWeb ? ResponsiveStyles.webTitle : {
              textAlign: 'center',
              fontSize: layout.fontSize.xlarge * 1.2,
              fontWeight: 'bold',
              fontFamily: 'Arial',
              color: Colors.primary,
              marginBottom: 8
            }}>
              PolyGlotPal
            </Text>

            <Text style={layout.isWeb ? ResponsiveStyles.webSubtitle : {
              textAlign: 'center',
              fontSize: layout.fontSize.medium,
              fontWeight: '500',
              color: '#666',
              marginBottom: 16
            }}>
              Learn a language for free, Forever
            </Text>

            <Text style={{
              textAlign: 'center',
              fontSize: layout.fontSize.small,
              color: '#888',
              fontStyle: 'italic'
            }}>
              Master new languages with interactive lessons
            </Text>
          </View>

          {/* Hero Image */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Image
              source={require('../../assets/images/language.png')}
              style={{
                width: layout.isWeb ? 300 : layout.screenWidth * 0.6,
                height: layout.isWeb ? 240 : layout.screenWidth * 0.48,
                borderRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8
              }}
              contentFit="contain"
            />
          </View>

          {/* Features */}
          <View style={{
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            padding: 20,
            marginBottom: 32
          }}>
            <Text style={{
              fontSize: layout.fontSize.large,
              fontWeight: '600',
              color: Colors.text,
              textAlign: 'center',
              marginBottom: 16
            }}>
              Why Choose PolyGlotPal?
            </Text>

            <View style={{ gap: 12 }}>
              {[
                { icon: '🎯', text: 'Interactive learning exercises' },
                { icon: '🏆', text: 'Track your progress daily' },
                { icon: '🌍', text: 'Multiple language support' },
                { icon: '💯', text: 'Completely free forever' }
              ].map((feature, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  padding: 12,
                  borderRadius: 8
                }}>
                  <Text style={{ fontSize: 24, marginRight: 12 }}>{feature.icon}</Text>
                  <Text style={{
                    fontSize: layout.fontSize.medium,
                    color: Colors.text,
                    flex: 1
                  }}>
                    {feature.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{
            alignItems: 'center',
            gap: 16,
          }}>
            <TouchableOpacity
              style={layout.isWeb ? ResponsiveStyles.webButton : [
                GlobalStyles.button,
                {
                  width: layout.buttonWidth,
                  marginBottom: 0,
                  shadowColor: Colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6
                }
              ]}
              onPress={() => router.push('/register')}
            >
              <Text style={layout.isWeb ? ResponsiveStyles.webButtonText : [
                GlobalStyles.buttonText,
                { fontSize: layout.fontSize.medium }
              ]}>
                Get Started - It's Free!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={layout.isWeb ? [
                ResponsiveStyles.webButton,
                ResponsiveStyles.webButtonSecondary
              ] : [
                GlobalStyles.button,
                {
                  width: layout.buttonWidth,
                  backgroundColor: 'transparent',
                  borderWidth: 2,
                  borderColor: Colors.primary
                }
              ]}
              onPress={() => router.push('/login')}
            >
              <Text style={layout.isWeb ? ResponsiveStyles.webButtonSecondaryText : [
                GlobalStyles.buttonText,
                { fontSize: layout.fontSize.medium, color: Colors.primary }
              ]}>
                I Already Have an Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={{
            marginTop: 32,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: layout.fontSize.small,
              color: '#888',
              textAlign: 'center'
            }}>
              Join millions of learners worldwide
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}