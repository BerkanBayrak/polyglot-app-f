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

export default function VocabularyScreen() {
  const { user, loading } = useAuth();
  const { sourceLang, targetLang } = useLanguage();
  const layout = useResponsiveLayout();
  const router = useRouter();
  const { level, lang } = useLocalSearchParams();
  const numericLevel = parseInt(Array.isArray(level) ? level[0] : level || '1');

  const [isMounted, setIsMounted] = useState(false);
  const [questionGroups, setQuestionGroups] = useState<any[][]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<{ [sourceId: number]: number }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledTargets, setShuffledTargets] = useState<any[]>([]);
  const currentLang = lang || 'trtoeng';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && isMounted) {
      const timer = setTimeout(() => router.replace('/'), 100);
      return () => clearTimeout(timer);
    }
  }, [user, loading, isMounted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!lang || !numericLevel || !user) return;

      // now do fetch safely
    }, 100); // wait 100ms

    return () => clearTimeout(timer); // cleanup
  }, [lang, numericLevel, user]);


  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/vocabulary/${numericLevel}?lang=${currentLang}`)
      .then(res => res.json())
      .then(data => {
        const grouped = Object.values(
          data.reduce((acc, item) => {
            if (!acc[item.question_id]) acc[item.question_id] = [];
            acc[item.question_id].push(item);
            return acc;
          }, {})
        );
        setQuestionGroups(grouped);
        setQuestionIndex(0);
        setScore(0);
        setSelectedWords({});
        setShowAnswers(false);
      })
      .catch(err => console.error('Failed to fetch vocabulary questions:', err));
  }, [numericLevel,lang]);

  const currentQuestion = questionGroups[questionIndex] || [];

  useEffect(() => {
    if (currentQuestion.length > 0) {
      const shuffled = [...currentQuestion].sort(() => Math.random() - 0.5);
      setShuffledTargets(shuffled);
    }
  }, [questionIndex, currentQuestion]);

  if (!user || loading || !isMounted) return null;

  const handleWordSelection = (sourceId: number, targetId: number) => {
    if (showAnswers) return;
    setSelectedWords(prev => ({ ...prev, [sourceId]: targetId }));
  };

  const checkAnswers = () => {
    const correct = currentQuestion.filter(w => selectedWords[w.id] === w.id).length;
    setScore(prev => prev + correct);
    setShowAnswers(true);
  };

  const nextQuestion = async () => {
    const isLast = questionIndex >= questionGroups.length - 1;
    if (isLast) {
      await submitProgress();
      router.push(`/(tabs)/mainscreen?lang=${currentLang}`);
    } else {
      setQuestionIndex(prev => prev + 1);
      setSelectedWords({});
      setShowAnswers(false);
    }
  };

  const submitProgress = async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          activity_type: 'vocabulary',
          level: numericLevel,
          score: score,
          completed: score === questionGroups.length * 6 ? 1 : 0,
          lang:currentLang
        })
      });
    } catch (err) {
      console.error('Progress submission failed:', err);
    }
  };

  const resetExercise = () => {
    setQuestionIndex(0);
    setScore(0);
    setSelectedWords({});
    setShowAnswers(false);
  };

  const containerStyle = layout.isWeb ? ResponsiveStyles.webContainer : GlobalStyles.container;
  const cardStyle = layout.isWeb
    ? { ...ResponsiveStyles.webCard, minHeight: '90vh' }
    : GlobalStyles.whiteBackgroundContainer;

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
              onPress={() => router.push(`/(tabs)/mainscreen?lang=${currentLang}`)}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={[
              GlobalStyles.headerText,
              layout.isWeb && ResponsiveStyles.webTitle
            ]}>
              Vocabulary Matching
            </Text>
            <Image
              source={getFlagImage(targetLang)}
              style={GlobalStyles.flagImage}
            />
          </View>

          {/* Progress Bar */}
          <View style={{
            backgroundColor: '#f0f0f0',
            height: 8,
            borderRadius: 4,
            marginHorizontal: layout.isWeb ? 0 : 20,
            marginBottom: 20,
            overflow: 'hidden'
          }}>
            <View style={{
              backgroundColor: Colors.primary,
              height: '100%',
              width: `${((questionIndex + 1) / questionGroups.length) * 100}%`,
              borderRadius: 4
            }} />
          </View>

          {/* Level and Question Info */}
          <View style={{
            backgroundColor: '#e3f2fd',
            padding: 16,
            borderRadius: 12,
            marginHorizontal: layout.isWeb ? 0 : 20,
            marginBottom: 24
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#1976d2',
              textAlign: 'center',
              marginBottom: 8
            }}>
              LEVEL {numericLevel} - Match the Words
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center'
            }}>
              Question {questionIndex + 1} of {questionGroups.length}
            </Text>
          </View>

          {/* Matching Grid */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: layout.isWeb ? 0 : 20,
            marginBottom: 24
          }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              {currentQuestion.map((item, index) => (
                <View key={index} style={{
                  padding: 12,
                  marginVertical: 4,
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: '#ccc'
                }}>
                  <Text style={{ fontSize: 16 }}>{item.source_word}</Text>
                </View>
              ))}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              {shuffledTargets.map((item, index) => {
                const selected = Object.values(selectedWords).includes(item.id);
                const correct = showAnswers && selectedWords[item.id] === item.id;

                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      padding: 12,
                      marginVertical: 4,
                      borderRadius: 10,
                      backgroundColor: showAnswers
                        ? correct ? '#c8e6c9' : selected ? '#ffcdd2' : '#fff'
                        : selected ? '#bbdefb' : '#fff',
                      borderWidth: 2,
                      borderColor: showAnswers
                        ? correct ? '#4caf50' : selected ? '#f44336' : '#ccc'
                        : selected ? '#2196f3' : '#ccc'
                    }}
                    onPress={() => {
                      const unselectedSource = currentQuestion.find(q => !selectedWords[q.id]);
                      if (unselectedSource) {
                        handleWordSelection(unselectedSource.id, item.id);
                      }
                    }}
                    disabled={showAnswers || selected}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: showAnswers && correct
                        ? '#2e7d32'
                        : showAnswers && selected
                        ? '#c62828'
                        : '#333'
                    }}>
                      {item.target_word}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Buttons */}
          <View style={{
            flexDirection: layout.isWeb ? 'row' : 'column',
            gap: 12,
            marginTop: 20
          }}>
            {!showAnswers ? (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  flex: layout.isWeb ? 1 : undefined,
                  opacity: Object.keys(selectedWords).length === currentQuestion.length ? 1 : 0.6
                }}
                onPress={checkAnswers}
                disabled={Object.keys(selectedWords).length !== currentQuestion.length}
              >
                <Text style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '600'
                }}>
                  Check Answer
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#fff',
                    borderWidth: 2,
                    borderColor: Colors.primary,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    flex: layout.isWeb ? 1 : undefined
                  }}
                  onPress={resetExercise}
                >
                  <Text style={{
                    color: Colors.primary,
                    fontSize: 16,
                    fontWeight: '600'
                  }}>
                    Try Again
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.primary,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    flex: layout.isWeb ? 1 : undefined
                  }}
                  onPress={nextQuestion}
                >
                  <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600'
                  }}>
                    {questionIndex < questionGroups.length - 1 ? 'Next Question' : 'Finish Exercise'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Score Display */}
          <View style={{
            backgroundColor: '#f8f9fa',
            padding: 16,
            borderRadius: 12,
            marginTop: 20,
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: 14,
              color: '#666',
              marginBottom: 4
            }}>
              Current Score
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: Colors.primary
            }}>
              {score} / {questionGroups.length * 6}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );


}