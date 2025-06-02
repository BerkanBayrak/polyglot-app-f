import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Colors, GlobalStyles } from '@/constants/Theme';
import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { getFlagImage } from '@/utils/helpers';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function FillTheBlanksScreen() {
  const { sourceLang, targetLang } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();
  const layout = useResponsiveLayout();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
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

  const fillBlankQuestions = [
    {
      id: 1,
      dialogue: [
        { speaker: 'A', text: 'How _____ you?', blank: true, options: ['are', 'is', 'has'], correct: 'are' },
        { speaker: 'B', text: 'I am fine, thank you.', blank: false }
      ],
      explanation: "We use 'are' with 'you' in questions and statements."
    },
    {
      id: 2,
      dialogue: [
        { speaker: 'A', text: 'What _____ your name?', blank: true, options: ['is', 'are', 'am'], correct: 'is' },
        { speaker: 'B', text: 'My name is Sarah.', blank: false }
      ],
      explanation: "We use 'is' with singular nouns like 'name'."
    },
    {
      id: 3,
      dialogue: [
        { speaker: 'A', text: 'Where _____ you from?', blank: true, options: ['are', 'is', 'do'], correct: 'are' },
        { speaker: 'B', text: 'I am from Turkey.', blank: false }
      ],
      explanation: "We use 'are' with 'you' when asking about origin or location."
    }
  ];

  const currentQ = fillBlankQuestions[currentQuestion];
  const blankLine = currentQ.dialogue.find(line => line.blank);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      Alert.alert('Please select an answer');
      return;
    }

    setShowResult(true);
    if (selectedAnswer === blankLine?.correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < fillBlankQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      Alert.alert(
        'Exercise Complete!',
        `You scored ${score + (selectedAnswer === blankLine?.correct ? 1 : 0)} out of ${fillBlankQuestions.length}`,
        [
          { text: 'Try Again', onPress: resetQuiz },
          { text: 'Continue Learning', onPress: () => router.push('/(tabs)/mainscreen') }
        ]
      );
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
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
              Fill the Blanks
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
              width: `${((currentQuestion + 1) / fillBlankQuestions.length) * 100}%`,
              borderRadius: 4
            }} />
          </View>

          {/* Level and Question Counter */}
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
              LEVEL 8 - Complete the Dialogue
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center'
            }}>
              Question {currentQuestion + 1} of {fillBlankQuestions.length}
            </Text>
          </View>

          {/* Dialogue Section */}
          <View style={{
            paddingHorizontal: layout.isWeb ? 0 : 20
          }}>
            <View style={{
              backgroundColor: '#f8f9fa',
              borderRadius: 16,
              padding: 24,
              marginBottom: 30
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20
              }}>
                <Ionicons name="chatbubbles-outline" size={24} color={Colors.primary} />
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: Colors.primary,
                  marginLeft: 8
                }}>
                  Conversation
                </Text>
              </View>

              {currentQ.dialogue.map((line, index) => (
                <View key={index} style={{
                  marginBottom: 16,
                  padding: 16,
                  backgroundColor: line.speaker === 'A' ? '#e3f2fd' : '#f3e5f5',
                  borderRadius: 12,
                  borderLeft: `4px solid ${line.speaker === 'A' ? '#2196f3' : '#9c27b0'}`
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: line.speaker === 'A' ? '#1565c0' : '#7b1fa2',
                    marginBottom: 8
                  }}>
                    Speaker {line.speaker}:
                  </Text>

                  <Text style={{
                    fontSize: 18,
                    lineHeight: 28,
                    color: '#333'
                  }}>
                    {line.blank ? (
                      <>
                        {line.text.split('_____')[0]}
                        <Text style={{
                          backgroundColor: showResult
                            ? (selectedAnswer === line.correct ? '#c8e6c9' : '#ffcdd2')
                            : (selectedAnswer ? '#bbdefb' : '#fff'),
                          borderWidth: 2,
                          borderColor: showResult
                            ? (selectedAnswer === line.correct ? '#4caf50' : '#f44336')
                            : (selectedAnswer ? '#2196f3' : '#e0e0e0'),
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          borderRadius: 8,
                          fontSize: 18,
                          fontWeight: '600',
                          color: showResult
                            ? (selectedAnswer === line.correct ? '#2e7d32' : '#c62828')
                            : (selectedAnswer ? '#0d47a1' : '#666'),
                          minWidth: 80,
                          textAlign: 'center'
                        }}>
                          {selectedAnswer || '_____'}
                        </Text>
                        {line.text.split('_____')[1]}
                      </>
                    ) : (
                      line.text
                    )}
                  </Text>
                </View>
              ))}
            </View>

            {/* Options */}
            <View style={{
              gap: 12,
              marginBottom: 30
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: Colors.text,
                marginBottom: 8
              }}>
                Choose the correct word:
              </Text>

              {blankLine?.options.map((option, index) => {
                let buttonStyle = {
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: '#e0e0e0'
                };

                let textColor = '#333';

                if (selectedAnswer === option) {
                  if (showResult) {
                    if (option === blankLine.correct) {
                      buttonStyle = {
                        backgroundColor: '#c8e6c9',
                        borderWidth: 2,
                        borderColor: '#4caf50'
                      };
                      textColor = '#2e7d32';
                    } else {
                      buttonStyle = {
                        backgroundColor: '#ffcdd2',
                        borderWidth: 2,
                        borderColor: '#f44336'
                      };
                      textColor = '#c62828';
                    }
                  } else {
                    buttonStyle = {
                      backgroundColor: '#bbdefb',
                      borderWidth: 2,
                      borderColor: '#2196f3'
                    };
                    textColor = '#0d47a1';
                  }
                } else if (showResult && option === blankLine.correct) {
                  buttonStyle = {
                    backgroundColor: '#c8e6c9',
                    borderWidth: 2,
                    borderColor: '#4caf50'
                  };
                  textColor = '#2e7d32';
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      {
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2
                      },
                      buttonStyle
                    ]}
                    onPress={() => handleAnswerSelect(option)}
                    disabled={showResult}
                  >
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: textColor
                    }}>
                      {option}
                    </Text>

                    {showResult && option === blankLine.correct && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4caf50"
                        style={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    )}

                    {showResult && selectedAnswer === option && option !== blankLine.correct && (
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color="#f44336"
                        style={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation */}
            {showResult && (
              <View style={{
                backgroundColor: '#fff3e0',
                padding: 16,
                borderRadius: 12,
                marginBottom: 20,
                borderLeft: '4px solid #ff9800'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="bulb-outline" size={20} color="#f57c00" />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#e65100',
                    marginLeft: 8
                  }}>
                    Explanation
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: '#bf360c',
                  lineHeight: 20
                }}>
                  {currentQ.explanation}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={{
              flexDirection: layout.isWeb ? 'row' : 'column',
              gap: 12
            }}>
              {!showResult ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.primary,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    flex: layout.isWeb ? 1 : undefined,
                    opacity: selectedAnswer ? 1 : 0.6
                  }}
                  onPress={checkAnswer}
                  disabled={!selectedAnswer}
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
                    onPress={resetQuiz}
                  >
                    <Text style={{
                      color: Colors.primary,
                      fontSize: 16,
                      fontWeight: '600'
                    }}>
                      Restart Exercise
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
                      {currentQuestion < fillBlankQuestions.length - 1 ? 'Next Question' : 'Finish Exercise'}
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
                {score} / {fillBlankQuestions.length}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}