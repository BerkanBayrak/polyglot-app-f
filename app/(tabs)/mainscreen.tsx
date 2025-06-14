import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { Colors, GlobalStyles } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { getFlagImage } from '@/utils/helpers';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function MainScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const layout = useResponsiveLayout();
  const { sourceLang, targetLang } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const { lang } = useLocalSearchParams();
  const currentLang = lang || `${sourceLang?.toLowerCase()}to${targetLang?.toLowerCase()}` || 'trtoeng';


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

  const containerStyle = layout.isWeb ?
    ResponsiveStyles.webContainer :
    GlobalStyles.container;

  const cardStyle = layout.isWeb ?
    { ...ResponsiveStyles.webCard, minHeight: '80vh' } :
    GlobalStyles.whiteBackgroundContainer;

  const learningActivities = [
    {
      title: 'Vocabulary',
      subtitle: 'Learn new words',
      icon: 'book-outline',
      color: '#FF6B6B',
      activityType: 'vocabulary'
    },
    {
      title: 'Grammar',
      subtitle: 'Master grammar rules',
      icon: 'library-outline',
      color: '#4ECDC4',
      activityType: 'grammar'
    },
    {
      title: 'Fill the Blanks',
      subtitle: 'Complete sentences',
      icon: 'create-outline',
      color: '#45B7D1',
      activityType: 'filltheblanks'
    },
    {
      title: 'Image Based',
      subtitle: 'Visual learning',
      icon: 'image-outline',
      color: '#FFA726',
      activityType: 'imagebased'
    },
    {
      title: 'Sentences',
      subtitle: 'Build sentences',
      icon: 'chatbubble-outline',
      color: '#AB47BC',
      activityType: 'sentences'
    }
  ];


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
            <View style={{ width: 24 }} />
            <Text style={[
              GlobalStyles.headerText,
              layout.isWeb && ResponsiveStyles.webTitle
            ]}>
              Learn {targetLang?.toUpperCase()}
            </Text>
            <TouchableOpacity
              style={GlobalStyles.settingsButton}
              onPress={() => router.push('/(tabs)/settings')}
            >
              <Ionicons name="settings-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Language Display */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: '#f8f9fa',
            borderRadius: 12,
            marginHorizontal: layout.isWeb ? 0 : 20
          }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={getFlagImage(sourceLang) || require('@/assets/images/flags/tr.png')}
                style={{ width: 40, height: 40, borderRadius: 20, marginBottom: 8 }}
              />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#666' }}>
                {sourceLang?.toUpperCase()}
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={24} color="#666" style={{ marginHorizontal: 20 }} />

            <View style={{ alignItems: 'center' }}>
              <Image
                source={getFlagImage(targetLang) || require('@/assets/images/flags/eng.png')}
                style={{ width: 40, height: 40, borderRadius: 20, marginBottom: 8 }}
              />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#666' }}>
                {targetLang?.toUpperCase()}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/language-selection')}
              style={{ marginLeft: 20 }}
            >
              <Ionicons name="swap-horizontal" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Progress Section */}
          <View style={{
            backgroundColor: '#e3f2fd',
            padding: 20,
            borderRadius: 12,
            marginHorizontal: layout.isWeb ? 0 : 20,
            marginBottom: 30
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1976d2', marginBottom: 8 }}>
              Today's Progress
            </Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
              Continue your learning streak!
            </Text>
            <View style={{
              backgroundColor: '#bbdefb',
              height: 8,
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <View style={{
                backgroundColor: '#1976d2',
                height: '100%',
                width: '30%',
                borderRadius: 4
              }} />
            </View>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              3 of 10 lessons completed
            </Text>
          </View>

          {/* Learning Activities Grid */}
          <View style={{
            paddingHorizontal: layout.isWeb ? 0 : 20
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: Colors.text,
              marginBottom: 20
            }}>
              Learning Activities
            </Text>

            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: layout.isWeb ? 20 : 15
            }}>
              {learningActivities.map((activity, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: layout.isWeb ? 'calc(50% - 10px)' : '48%',
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 15,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: '#f0f0f0'
                  }}
                  onPress={() => router.push(`/(tabs)/levels?activity=${activity.activityType}&lang=${currentLang}`)}



                >
                  <View style={{
                    width: 50,
                    height: 50,
                    backgroundColor: activity.color + '20',
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 15
                  }}>
                    <Ionicons name={activity.icon} size={24} color={activity.color} />
                  </View>

                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Colors.text,
                    marginBottom: 4
                  }}>
                    {activity.title}
                  </Text>

                  <Text style={{
                    fontSize: 12,
                    color: '#666'
                  }}>
                    {activity.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Daily Challenge */}
          <View style={{
            backgroundColor: '#fff3e0',
            padding: 20,
            borderRadius: 12,
            marginHorizontal: layout.isWeb ? 0 : 20,
            marginTop: 20,
            borderLeft: '4px solid #ff9800'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="trophy-outline" size={20} color="#ff9800" />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#e65100',
                marginLeft: 8
              }}>
                Daily Challenge
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#bf360c', marginBottom: 12 }}>
              Complete 5 vocabulary exercises to earn 50 XP!
            </Text>
            <TouchableOpacity style={{
              backgroundColor: '#ff9800',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              alignSelf: 'flex-start'
            }}>
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                Start Challenge
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}