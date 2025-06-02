import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Colors, GlobalStyles } from '@/constants/Theme';
import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { sourceLang, targetLang } = useLanguage();
  const { logout, user, loading } = useAuth();
  const router = useRouter();
  const layout = useResponsiveLayout();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Tüm hook'ları en üstte çağır
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && isMounted) {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, loading, isMounted, router]);

  // Early returns - hook'lardan sonra
  if (loading || !isMounted || !user) {
    return null;
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const containerStyle = layout.isWeb ?
    ResponsiveStyles.webContainer :
    GlobalStyles.container;

  const cardStyle = layout.isWeb ?
    { ...ResponsiveStyles.webCard, minHeight: '90vh' } :
    GlobalStyles.whiteBackgroundContainer;

  return (
    <View style={containerStyle}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: layout.isWeb ? 40 : 100
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyle}>
          {/* Header */}
          <View style={[
            GlobalStyles.headerContainer,
            layout.isWeb && { paddingHorizontal: 0, marginBottom: 30 }
          ]}>
            <TouchableOpacity
              style={GlobalStyles.backButton}
              onPress={() => router.push('/(tabs)/mainscreen')}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={[
              GlobalStyles.headerText,
              layout.isWeb && ResponsiveStyles.webTitle
            ]}>
              Settings
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={{
            paddingHorizontal: layout.isWeb ? 0 : 16
          }}>
            {/* User Info Section */}
            <View style={{
              backgroundColor: '#f8f9fa',
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: Colors.primary + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16
              }}>
                <Ionicons name="person" size={30} color={Colors.primary} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: Colors.text,
                  marginBottom: 4
                }}>
                  {user?.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666'
                }}>
                  {user?.email}
                </Text>
                <View style={{
                  backgroundColor: '#28a745',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 4,
                  alignSelf: 'flex-start',
                  marginTop: 4
                }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>
                    Active
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/(tabs)/profile')}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: '#fff'
                }}
              >
                <Ionicons name="create-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Learning Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 16,
                color: Colors.text
              }}>
                Learning
              </Text>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: '#f0f0f0'
                }}
                onPress={() => router.push('/language-selection')}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#e3f2fd',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <Ionicons name="language-outline" size={20} color="#1976d2" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: Colors.text
                  }}>
                    Change Language
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
                    marginTop: 2
                  }}>
                    {sourceLang?.toUpperCase()} → {targetLang?.toUpperCase()}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#f0f0f0'
                }}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#fff3e0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <Ionicons name="stats-chart-outline" size={20} color="#f57c00" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: Colors.text
                  }}>
                    View Progress
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
                    marginTop: 2
                  }}>
                    Track your learning journey
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>

            {/* Preferences Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 16,
                color: Colors.text
              }}>
                Preferences
              </Text>

              <View style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#f0f0f0',
                overflow: 'hidden'
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0'
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#e8f5e8',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                  }}>
                    <Ionicons name="notifications-outline" size={20} color="#4caf50" />
                  </View>
                  <Text style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: '500',
                    color: Colors.text
                  }}>
                    Push Notifications
                  </Text>
                  <Switch
                    value={pushNotifications}
                    onValueChange={setPushNotifications}
                    trackColor={{ false: '#767577', true: Colors.primary + '40' }}
                    thumbColor={pushNotifications ? Colors.primary : '#f4f3f4'}
                  />
                </View>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#e3f2fd',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                  }}>
                    <Ionicons name="moon-outline" size={20} color="#1976d2" />
                  </View>
                  <Text style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: '500',
                    color: Colors.text
                  }}>
                    Dark Mode
                  </Text>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: '#767577', true: Colors.primary + '40' }}
                    thumbColor={darkMode ? Colors.primary : '#f4f3f4'}
                  />
                </View>
              </View>
            </View>

            {/* Support Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 16,
                color: Colors.text
              }}>
                Support & About
              </Text>

              <View style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#f0f0f0',
                overflow: 'hidden'
              }}>
                {[
                  { icon: 'help-circle-outline', title: 'Help & Support', color: '#ff9800' },
                  { icon: 'shield-outline', title: 'Privacy Policy', color: '#4caf50' },
                  { icon: 'document-text-outline', title: 'Terms of Service', color: '#2196f3' },
                  { icon: 'information-circle-outline', title: 'About PolyGlotPal', color: '#9c27b0' }
                ].map((item, index, array) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderBottomWidth: index < array.length - 1 ? 1 : 0,
                      borderBottomColor: '#f0f0f0'
                    }}
                  >
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: item.color + '20',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12
                    }}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <Text style={{
                      flex: 1,
                      fontSize: 16,
                      fontWeight: '500',
                      color: Colors.text
                    }}>
                      {item.title}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                borderWidth: 2,
                borderColor: '#ff3b30'
              }}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
              <Text style={{
                color: '#ff3b30',
                fontSize: 16,
                fontWeight: '600',
                marginLeft: 8
              }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
