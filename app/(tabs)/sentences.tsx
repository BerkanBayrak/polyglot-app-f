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

export default function SentencesScreen() {
  const { sourceLang, targetLang } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();
  const layout = useResponsiveLayout();
  const { level, lang } = useLocalSearchParams();

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [sentenceQuestions, setSentenceQuestions] = useState<any[]>([]);

  const layoutLevel = parseInt(typeof level === 'string' ? level : '1');
  const currentLang = lang || 'trtoeng';

  // Show when the component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!lang || !layoutLevel || !user) return;

      // now do fetch safely
    }, 100); // wait 100ms

    return () => clearTimeout(timer); // cleanup
  }, [lang, layoutLevel, user]);


  // Log auth state to debug
  useEffect(() => {
    console.log('🔍 useEffect Auth Check', { loading, user, isMounted });
    if (loading) return; // wait for auth to finish

    if (!user && isMounted) {
      console.log('🚪 Redirecting: user not found');
      const timer = setTimeout(() => {
        router.replace('/');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, loading, isMounted, router]);

  // Fetch sentence questions
  useEffect(() => {
    if (user && layoutLevel && lang) {
      console.log("Fetching with lang:", lang);

      fetch(`http://localhost:3001/api/sentences/${layoutLevel}?lang=${currentLang}`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map((q: any) => ({
            id: q.id,
            target: q.target,
            hint: q.hint,
            words: q.target.trim().split(' '),
            scrambled: shuffleArray(q.target.trim().split(' '))
          }));
          setSentenceQuestions(formatted);
          setCurrentQuestion(0);
          setScore(0);
          setShowResult(false);
        })
        .catch(err => {
          console.error('❌ Failed to load sentence questions:', err);
        });
    }
  }, [user, layoutLevel, lang]);



  // Initialize question
  useEffect(() => {
    if (sentenceQuestions.length > 0 && sentenceQuestions[currentQuestion]) {
      const currentQ = sentenceQuestions[currentQuestion];
      setAvailableWords([...currentQ.scrambled]);
      setSelectedWords([]);
      setShowResult(false);
    }
  }, [currentQuestion, sentenceQuestions]);

  // Shuffle helper
  const shuffleArray = (array: string[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // ✅ DEBUG: Final check before rendering
  console.log('🧠 Render check:', { loading, user, isMounted, questions: sentenceQuestions.length });

  // Early return if something isn't ready
  if (!isMounted) {
    return <Text style={{ color: 'white' }}>Component not mounted yet</Text>;
  }
  if (loading) {
    return <Text style={{ color: 'white' }}>Loading user data...</Text>;
  }
  if (!user) {
    return <Text style={{ color: 'white' }}>Please log in to continue</Text>;
  }


  if (!isMounted) {
    return <Text style={{ color: 'white' }}>Component not mounted yet</Text>;
  }
  if (loading) {
    return <Text style={{ color: 'white' }}>Loading user data...</Text>;
  }
  if (!user) {
    return <Text style={{ color: 'white' }}>Please log in to continue</Text>;
  }
  if (sentenceQuestions.length === 0) {
    return <Text style={{ color: 'white' }}>No sentence questions found for this level.</Text>;
  }

  const currentQ = sentenceQuestions[currentQuestion]; // ✅ SAFE to access now



  
  // Early returns - hook'lardan sonra
  if (loading || !isMounted || !user) {
      return null;
  }

  const handleWordSelect = (word: string, fromAvailable: boolean) => {
      if (showResult) return;

      if (fromAvailable) {
        // Remove first occurrence of the word from availableWords
        const index = availableWords.indexOf(word);
        if (index !== -1) {
          const updatedAvailable = [...availableWords];
          updatedAvailable.splice(index, 1);
          setAvailableWords(updatedAvailable);
          setSelectedWords(prev => [...prev, word]);
        }
      } else {
        // Move back to availableWords
        const index = selectedWords.indexOf(word);
        if (index !== -1) {
          const updatedSelected = [...selectedWords];
          updatedSelected.splice(index, 1);
          setSelectedWords(updatedSelected);
          setAvailableWords(prev => [...prev, word]);
        }
      }
  };

  const checkSentence = () => {
    if (selectedWords.length === 0) {
      Alert.alert('Please build a sentence first');
      return;
    }

    const userSentence = selectedWords.join(' ').trim();
    const correctSentence = currentQ.target.trim();

    setShowResult(true);
    if (userSentence === correctSentence) {
      setScore(prev => prev + 1);
    }
  };

  const submitProgress = async (finalScore: number) => {
    try {
      await fetch('http://localhost:3001/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          activity_type: 'sentences',
          level: layoutLevel,
          score: finalScore,
          completed: finalScore === sentenceQuestions.length ? 1 : 0,
          lang:currentLang
        })
      });
    } catch (err) {
      console.error('Failed to submit progress:', err);
    }
  };

  const nextQuestion = async () => {
    const userSentence = selectedWords.join(' ').trim();
    const correct = userSentence === currentQ.target.trim();
    const finalScore = score;

    if (currentQuestion < sentenceQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setScore(finalScore);
    } else {
      await submitProgress(finalScore); 
      router.push(`/(tabs)/mainscreen?lang=${currentLang}`);
      Alert.alert(
        'Sentence Building Complete!',
        `You scored ${finalScore} out of ${sentenceQuestions.length}`,
        [
          { text: 'Try Again', onPress: resetQuiz },
          { text: 'Main Menu', onPress: () => router.push('/(tabs)/mainscreen') }
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

  const userSentence = selectedWords.join(' ');
  const isCorrect = userSentence.trim() === currentQ.target.trim();


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
              LEVEL {layoutLevel} - Build Sentences
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