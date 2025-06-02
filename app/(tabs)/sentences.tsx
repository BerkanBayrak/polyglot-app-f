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

export default function SentencesScreen() {
  const { sourceLang, targetLang } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();
  const layout = useResponsiveLayout();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const sentenceQuestions = [
    {
      id: 1,
      target: "What is your name?",
      words: ["What", "is", "your", "name", "?"],
      scrambled: ["name", "What", "your", "is", "?"],
      hint: "A question asking for someone's identity"
    },
    {
      id: 2,
      target: "I am learning English.",
      words: ["I", "am", "learning", "English", "."],
      scrambled: ["learning", "am", "English", "I", "."],
      hint: "A statement about studying a language"
    },
    {
      id: 3,
      target: "The book is on the table.",
      words: ["The", "book", "is", "on", "the", "table", "."],
      scrambled: ["table", "book", "on", "The", "is", "the", "."],
      hint: "Describing the location of an object"
    }
  ];

  const currentQ = sentenceQuestions[currentQuestion];

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

  // Initialize available words when question changes - dependency array'e currentQ eklendi
  useEffect(() => {
    if (currentQ) {
      setAvailableWords([...currentQ.scrambled]);
      setSelectedWords([]);
      setShowResult(false);
    }
  }, [currentQuestion]); // currentQ yerine currentQuestion kullanıyoruz

  // Early returns - hook'lardan sonra
  if (loading || !isMounted || !user) {
    return null;
  }

  const handleWordSelect = (word: string, fromAvailable: boolean) => {
    if (showResult) return;

    if (fromAvailable) {
      // Move word from available to selected
      setAvailableWords(prev => prev.filter((w, i) => prev.indexOf(word) !== i || prev.slice(0, i).includes(word)));
      setSelectedWords(prev => [...prev, word]);
    } else {
      // Move word from selected back to available
      const wordIndex = selectedWords.indexOf(word);
      setSelectedWords(prev => prev.filter((_, i) => i !== wordIndex));
      setAvailableWords(prev => [...prev, word]);
    }
  };

  const checkSentence = () => {
    if (selectedWords.length === 0) {
      Alert.alert('Please build a sentence first');
      return;
    }

    const userSentence = selectedWords.join(' ');
    const correctSentence = currentQ.target;

    setShowResult(true);

    if (userSentence === correctSentence) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < sentenceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setScore(score);
    } else {
      // Quiz completed
      const finalScore = score + (selectedWords.join(' ') === currentQ.target ? 1 : 0);
      Alert.alert(
        'Sentence Building Complete!',
        `You scored ${finalScore} out of ${sentenceQuestions.length}`,
        [
          { text: 'Try Again', onPress: resetQuiz },
          { text: 'Continue Learning', onPress: () => router.push('/(tabs)/mainscreen') }
        ]
      );
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  const clearSentence = () => {
    setAvailableWords([...currentQ.scrambled]);
    setSelectedWords([]);
  };

  const containerStyle = layout.isWeb ?
    ResponsiveStyles.webContainer :
    GlobalStyles.container;

  const cardStyle = layout.isWeb ?
    { ...ResponsiveStyles.webCard, minHeight: '90vh' } :
    GlobalStyles.whiteBackgroundContainer;

  const userSentence = selectedWords.join(' ');
  const isCorrect = userSentence === currentQ.target;

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
              Sentences
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
              width: `${((currentQuestion + 1) / sentenceQuestions.length) * 100}%`,
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
              LEVEL 1 - Build Sentences
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center'
            }}>
              Question {currentQuestion + 1} of {sentenceQuestions.length}
            </Text>
          </View>

          {/* Sentence Building Area */}
          <View style={{
            paddingHorizontal: layout.isWeb ? 0 : 20
          }}>
            {/* Hint */}
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
                  Hint
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: '#bf360c',
                lineHeight: 20
              }}>
                {currentQ.hint}
              </Text>
            </View>

            {/* Sentence Display Area */}
            <View style={{
              backgroundColor: '#f8f9fa',
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              minHeight: 80,
              justifyContent: 'center',
              borderWidth: showResult ? 2 : 1,
              borderColor: showResult
                ? (isCorrect ? '#4caf50' : '#f44336')
                : '#e0e0e0'
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: Colors.primary,
                  marginLeft: 8
                }}>
                  Your Sentence:
                </Text>

                {selectedWords.length > 0 && (
                  <TouchableOpacity
                    onPress={clearSentence}
                    style={{ marginLeft: 'auto' }}
                    disabled={showResult}
                  >
                    <Ionicons name="refresh-outline" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                minHeight: 40
              }}>
                {selectedWords.length === 0 ? (
                  <Text style={{
                    fontSize: 16,
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    Tap words below to build your sentence...
                  </Text>
                ) : (
                  selectedWords.map((word, index) => (
                    <TouchableOpacity
                      key={`selected-${index}`}
                      style={{
                        backgroundColor: showResult
                          ? (isCorrect ? '#c8e6c9' : '#ffcdd2')
                          : '#bbdefb',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        marginRight: 8,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: showResult
                          ? (isCorrect ? '#4caf50' : '#f44336')
                          : '#2196f3'
                      }}
                      onPress={() => handleWordSelect(word, false)}
                      disabled={showResult}
                    >
                      <Text style={{
                        fontSize: 16,
                        color: showResult
                          ? (isCorrect ? '#2e7d32' : '#c62828')
                          : '#0d47a1',
                        fontWeight: '500'
                      }}>
                        {word}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>

              {showResult && (
                <View style={{
                  marginTop: 12,
                  padding: 12,
                  backgroundColor: isCorrect ? '#e8f5e8' : '#fce4ec',
                  borderRadius: 8
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Ionicons
                      name={isCorrect ? "checkmark-circle" : "close-circle"}
                      size={16}
                      color={isCorrect ? '#4caf50' : '#f44336'}
                    />
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: isCorrect ? '#2e7d32' : '#c62828',
                      marginLeft: 4
                    }}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </Text>
                  </View>
                  <Text style={{
                    fontSize: 14,
                    color: isCorrect ? '#2e7d32' : '#c62828'
                  }}>
                    Correct answer: "{currentQ.target}"
                  </Text>
                </View>
              )}
            </View>

            {/* Available Words */}
            <View style={{
              marginBottom: 30
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: Colors.text,
                marginBottom: 12
              }}>
                Available Words:
              </Text>

              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                minHeight: 60,
                justifyContent: availableWords.length === 0 ? 'center' : 'flex-start',
                alignItems: availableWords.length === 0 ? 'center' : 'flex-start'
              }}>
                {availableWords.length === 0 ? (
                  <Text style={{
                    fontSize: 14,
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    All words used! ✨
                  </Text>
                ) : (
                  availableWords.map((word, index) => (
                    <TouchableOpacity
                      key={`available-${index}-${word}`}
                      style={{
                        backgroundColor: '#f0f0f0',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        marginRight: 8,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: '#ddd'
                      }}
                      onPress={() => handleWordSelect(word, true)}
                      disabled={showResult}
                    >
                      <Text style={{
                        fontSize: 16,
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        {word}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>

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
                    opacity: selectedWords.length > 0 ? 1 : 0.6
                  }}
                  onPress={checkSentence}
                  disabled={selectedWords.length === 0}
                >
                  <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600'
                  }}>
                    Check Sentence
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
                      {currentQuestion < sentenceQuestions.length - 1 ? 'Next Sentence' : 'Finish Exercise'}
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
                {score} / {sentenceQuestions.length}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}