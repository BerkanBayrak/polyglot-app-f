import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { Colors, GlobalStyles } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { getFlagImage } from '@/utils/helpers';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type ImageQuestion = {
  id: number;
  image: { uri: string } | null;
  question: string;
  options: string[];
  correct: string;
  description: string;
};

export default function ImageBasedScreen() {
  const { sourceLang, targetLang } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();
  const layout = useResponsiveLayout();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [imageQuestions, setImageQuestions] = useState<ImageQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const { level, lang } = useLocalSearchParams();
  const currentLevel = level || 1;
  const currentLang = lang || 'trtoeng';

  useEffect(() => {
    setIsMounted(true);
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (!lang || !currentLevel || !user) return;

      // now do fetch safely
    }, 100); // wait 100ms

    return () => clearTimeout(timer); // cleanup
  }, [lang, currentLevel, user]);


  useEffect(() => {
    setLoadingQuestions(true);
    fetch(`http://localhost:3001/api/image_questions/${Number(currentLevel)}?lang=${currentLang}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(q => ({
          id: q.id,
          image: q.image_url ? { uri: q.image_url } : null,
          question: q.question_text,
          options: [q.option_a, q.option_b, q.option_c],
          correct: q.correct_option,
          description: ''
        }));
        setImageQuestions(formatted);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setLoadingQuestions(false);
      })
      .catch(err => {
        console.error('❌ Failed to load image questions:', err);
        setLoadingQuestions(false);
      });
  }, [currentLevel,lang]);

  useEffect(() => {
    if (!loading && !user && isMounted) {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, loading, isMounted, router]);

  if (loading || !isMounted || !user) return null;
  if (loadingQuestions) return <Text>Loading image questions...</Text>;

  const currentQ: ImageQuestion | undefined = imageQuestions[currentQuestion];
  if (!currentQ) return <Text>No question found.</Text>; // ✅ Prevent undefined crash

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const checkAnswer = async () => {
    if (!selectedAnswer) {
      Alert.alert('Please select an answer');
      return;
    }

    setShowResult(true);

    const isCorrect = selectedAnswer === currentQ.correct;
    const newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);

    const isLast = currentQuestion === imageQuestions.length - 1;
    if (isLast) {
      await submitProgress(newScore);
    }
  };

  const submitProgress = async (finalScore: number) => {
    const isCompleted = finalScore === imageQuestions.length;
    

    const progressPayload = {
      user_id: user.id,
      activity_type: 'image_based',
      level: Number(currentLevel),
      score: finalScore,
      completed: isCompleted ? 1 : 0,
      lang:currentLang
    };
    
    try {
      
      const response = await fetch('http://localhost:3001/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      console.log('✅ Progress submitted:', progressPayload); // TEMP log
      Alert.alert('Progress Submitted', `Score: ${finalScore}`);
    } catch (error) {
      console.error('❌ Failed to save image progress:', error);
      Alert.alert('Progress Failed', String(error));
    }
  };


  const nextQuestion = () => {
    if (currentQuestion < imageQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      router.push(`/(tabs)/mainscreen?lang=${currentLang}`);
      Alert.alert(
        'Exercise Complete',
        `You scored ${score} out of ${imageQuestions.length}`,
        [
          { text: 'Try Again', onPress: resetQuiz },
          { text: 'Return', onPress: () => router.push('/(tabs)/mainscreen') }
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
              onPress={() => router.push(`/(tabs)/mainscreen?lang=${currentLang}`)}
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
              LEVEL {currentLevel} - Visual Learning

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
                {currentQ.image?.uri ? (
                  <Image
                    source={{ uri: currentQ.image.uri }}
                    style={{
                      width: layout.isWeb ? 200 : 180,
                      height: layout.isWeb ? 200 : 180,
                      borderRadius: 12
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <View
                    style={{
                      width: layout.isWeb ? 200 : 180,
                      height: layout.isWeb ? 200 : 180,
                      borderRadius: 12,
                      backgroundColor: '#eeeeee',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ color: '#999' }}>No image available</Text>
                  </View>
                )}
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