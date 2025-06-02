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

export default function ImageBasedScreen() {
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

  const imageQuestions = [
    {
      id: 1,
      image: require('@/assets/images/icon.png'),
      question: "What do you see in this image?",
      options: ['Apple', 'Book', 'Cat'],
      correct: 'Apple',
      description: 'A red apple on a white background'
    },
    {
      id: 2,
      image: require('@/assets/images/icon.png'),
      question: "What color is the object?",
      options: ['Blue', 'Red', 'Green'],
      correct: 'Red',
      description: 'The apple has a bright red color'
    },
    {
      id: 3,
      image: require('@/assets/images/icon.png'),
      question: "Where might you find this?",
      options: ['Kitchen', 'Library', 'Park'],
      correct: 'Kitchen',
      description: 'Apples are commonly found in kitchens'
    }
  ];

  const currentQ = imageQuestions[currentQuestion];

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
    if (selectedAnswer === currentQ.correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < imageQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      Alert.alert(
        'Visual Quiz Complete!',
        `You scored ${score + (selectedAnswer === currentQ.correct ? 1 : 0)} out of ${imageQuestions.length}`,
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
              Image Based
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
              width: `${((currentQuestion + 1) / imageQuestions.length) * 100}%`,
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
              LEVEL 2 - Visual Learning
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center'
            }}>
              Question {currentQuestion + 1} of {imageQuestions.length}
            </Text>
          </View>

          {/* Image Section */}
          <View style={{
            paddingHorizontal: layout.isWeb ? 0 : 20
          }}>
            <View style={{
              backgroundColor: '#f8f9fa',
              borderRadius: 20,
              padding: 24,
              marginBottom: 30,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8
            }}>
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}>
                <Image
                  source={currentQ.image}
                  style={{
                    width: layout.isWeb ? 200 : 180,
                    height: layout.isWeb ? 200 : 180,
                    borderRadius: 12
                  }}
                  resizeMode="contain"
                />
              </View>

              <View style={{
                backgroundColor: '#e8f5e8',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginBottom: 16
              }}>
                <Text style={{
                  fontSize: 12,
                  color: '#2e7d32',
                  fontWeight: '600'
                }}>
                  🔍 Study the image carefully
                </Text>
              </View>

              <Text style={{
                fontSize: 20,
                fontWeight: '600',
                color: Colors.text,
                textAlign: 'center',
                lineHeight: 28
              }}>
                {currentQ.question}
              </Text>
            </View>

            {/* Options */}
            <View style={{
              gap: 12,
              marginBottom: 30
            }}>
              {currentQ.options.map((option, index) => {
                let buttonStyle = {
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: '#e0e0e0'
                };

                let textColor = '#333';
                let iconName = null;

                if (selectedAnswer === option) {
                  if (showResult) {
                    if (option === currentQ.correct) {
                      buttonStyle = {
                        backgroundColor: '#c8e6c9',
                        borderWidth: 2,
                        borderColor: '#4caf50'
                      };
                      textColor = '#2e7d32';
                      iconName = 'checkmark-circle';
                    } else {
                      buttonStyle = {
                        backgroundColor: '#ffcdd2',
                        borderWidth: 2,
                        borderColor: '#f44336'
                      };
                      textColor = '#c62828';
                      iconName = 'close-circle';
                    }
                  } else {
                    buttonStyle = {
                      backgroundColor: '#bbdefb',
                      borderWidth: 2,
                      borderColor: '#2196f3'
                    };
                    textColor = '#0d47a1';
                  }
                } else if (showResult && option === currentQ.correct) {
                  buttonStyle = {
                    backgroundColor: '#c8e6c9',
                    borderWidth: 2,
                    borderColor: '#4caf50'
                  };
                  textColor = '#2e7d32';
                  iconName = 'checkmark-circle';
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 20,
                        borderRadius: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3
                      },
                      buttonStyle
                    ]}
                    onPress={() => handleAnswerSelect(option)}
                    disabled={showResult}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: textColor + '20',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16
                      }}>
                        <Text style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: textColor
                        }}>
                          {String.fromCharCode(65 + index)}
                        </Text>
                      </View>

                      <Text style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: textColor,
                        flex: 1
                      }}>
                        {option}
                      </Text>
                    </View>

                    {iconName && (
                      <Ionicons
                        name={iconName}
                        size={24}
                        color={textColor}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            {showResult && (
              <View style={{
                backgroundColor: '#fff3e0',
                padding: 16,
                borderRadius: 12,
                marginBottom: 20,
                borderLeft: '4px solid #ff9800'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="information-circle-outline" size={20} color="#f57c00" />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#e65100',
                    marginLeft: 8
                  }}>
                    About this image
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: '#bf360c',
                  lineHeight: 20
                }}>
                  {currentQ.description}
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
                      Restart Quiz
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
                      {currentQuestion < imageQuestions.length - 1 ? 'Next Image' : 'Finish Quiz'}
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
                {score} / {imageQuestions.length}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}