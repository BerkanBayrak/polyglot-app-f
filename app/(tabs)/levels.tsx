import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { GlobalStyles } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { getFlagImage } from '@/utils/helpers';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function LevelSelectionScreen() {
  const { activity, lang } = useLocalSearchParams();
  const normalizedActivity = Array.isArray(activity) ? activity[0] : activity || '';
  const router = useRouter();
  const layout = useResponsiveLayout();
  const { targetLang } = useLanguage();
  const { user } = useAuth();

  type ProgressRecord = {
    level: number;
    completed: number;
    score: number;
    activity_type: string;
  };

  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const levels = [1, 2, 3, 4, 5];

  const screenMap: Record<string, string> = {
    fill_in_blank: '/(tabs)/filltheblanks',
    vocabulary: '/(tabs)/vocabulary',
    multiple_choice: '/(tabs)/multiplechoice',
  };

  const targetScreen = screenMap[normalizedActivity] || '/(tabs)/mainscreen';


  const activityTypeMap: Record<string, string> = {
    filltheblanks: 'fill_in_blank',
    vocabulary: 'vocabulary',
    multiplechoice: 'multiple_choice',
    grammar: 'grammar',
    imagebased: 'image_based',
    sentences: 'sentences',
  };

  


  useFocusEffect(
    useCallback(() => {
      if (!user || !normalizedActivity) return;

      setLoading(true);
      const dbActivityType = activityTypeMap[normalizedActivity] || normalizedActivity;
      


      fetch(`${process.env.EXPO_PUBLIC_API_URL}/progress/${user.id}/${dbActivityType}?lang=${lang}`)


        .then(res => res.json())
        .then(data => {
          setProgress(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load progress:', err);
          setLoading(false);
        });
    }, [user, normalizedActivity])
  );

  const getLevelStatus = (level: number) => {
    if (level === 1) return 'unlocked';
    const dbActivityType = activityTypeMap[normalizedActivity] || normalizedActivity;
    const prevLevel = progress.find(
      p => p.level === level - 1 && p.activity_type === dbActivityType && p.completed === 1
    );

    if (prevLevel) {
      const currentLevel = progress.find(
        p => p.level === level && p.activity_type === dbActivityType
      );
      return currentLevel?.completed ? 'completed' : 'unlocked';
    }

    return 'locked';
  };


  const getLevelProgressIcon = (status: 'completed' | 'in_progress' | 'unlocked' | 'locked') => {
    if (status === 'completed') {
      return <Ionicons name="checkmark-circle" size={20} color="#2e7d32" style={{ marginLeft: 8 }} />;
    } else if (status === 'in_progress') {
      return <Ionicons name="time" size={20} color="#f9a825" style={{ marginLeft: 8 }} />;
    }
    return null;
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  const containerStyle = layout.isWeb ? ResponsiveStyles.webContainer : GlobalStyles.container;
  const cardStyle = layout.isWeb
    ? { ...ResponsiveStyles.webCard, minHeight: '80vh' }
    : GlobalStyles.whiteBackgroundContainer;

  const activityLabels: Record<string, string> = {
    filltheblanks: 'Fill in the Blanks',
    vocabulary: 'Vocabulary',
    multiplechoice: 'Multiple Choice',
    grammar: 'Grammar',
    imagebased: 'Image Based',
    sentences: 'Sentence Building',
  };


  return (
    <View style={containerStyle}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: layout.isWeb ? 40 : 100 }}
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
              Select {activityLabels[normalizedActivity] || normalizedActivity} Level
            </Text>
            <Image
              source={getFlagImage(targetLang)}
              style={GlobalStyles.flagImage}
            />
          </View>

          {/* Level Buttons */}
          <View style={{ paddingHorizontal: layout.isWeb ? 0 : 20 }}>
            {levels.map(level => {
              const status = getLevelStatus(level);
              const unlocked = status === 'unlocked' || status === 'completed';
              const icon = getLevelProgressIcon(status);

              return (
                <TouchableOpacity
                  key={level}
                  onPress={() => {
                    if (unlocked) {
                      router.push(`/${activity}?level=${level}&lang=${lang}`);






                    }
                  }}
                  disabled={!unlocked}
                  style={{
                    backgroundColor: unlocked ? '#e3f2fd' : '#eee',
                    padding: 16,
                    borderRadius: 10,
                    marginBottom: 12,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                    opacity: unlocked ? 1 : 0.5
                  }}
                >
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: unlocked ? '#1976d2' : '#aaa'
                  }}>
                    Level {level}
                  </Text>
                  {icon}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
