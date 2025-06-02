import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, ScrollView, Alert } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Colors, GlobalStyles } from '@/constants/Theme';
import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { getFlagImage } from '@/utils/helpers';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function VocabularyScreen() {
  const { sourceLang, targetLang } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();
  const layout = useResponsiveLayout();
  const [selectedWords, setSelectedWords] = useState<{ [key: number]: number }>({});
  const [showAnswers, setShowAnswers] = useState(false);
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

  const vocabularyData = [
    { id: 1, source: 'Hello', target: 'Merhaba' },
    { id: 2, source: 'Goodbye', target: 'Hoşçakal' },
    { id: 3, source: 'Please', target: 'Lütfen' },
    { id: 4, source: 'Thank you', target: 'Teşekkürler' },
    { id: 5, source: 'Yes', target: 'Evet' },
    { id: 6, source: 'No', target: 'Hayır' }
  ];

  const handleWordSelection = (sourceId: number, targetId: number) => {
    if (showAnswers) return;

    setSelectedWords(prev => ({
      ...prev,
      [sourceId]: targetId
    }));
  };

  const checkAnswers = () => {
    const correctAnswers = vocabularyData.filter(word =>
      selectedWords[word.id] === word.id
    ).length;

    setShowAnswers(true);

    Alert.alert(
      'Results',
      `You got ${correctAnswers} out of ${vocabularyData.length} correct!`,
      [
        { text: 'Try Again', onPress: resetGame },
        { text: 'Next Level', onPress: () => router.push('/(tabs)/mainscreen') }
      ]
    );
  };

  const resetGame = () => {
    setSelectedWords({});
    setShowAnswers(false);
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
              Vocabulary
            </Text>
            <Image
              source={getFlagImage(targetLang)}
              style={GlobalStyles.flagImage}
            />
          </View>

          {/* Level and Instructions */}
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
              LEVEL 1 - Basic Words
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center'
            }}>
              Match the words from {sourceLang?.toUpperCase()} to {targetLang?.toUpperCase()}
            </Text>
          </View>

          {/* Vocabulary Matching Game */}
          <View style={{
            paddingHorizontal: layout.isWeb ? 0 : 20
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20
            }}>
              {/* Source Language Column */}
              <View style={{ flex: 1, marginRight: 10 }}>
                <View style={{
                  backgroundColor: '#fff3e0',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#e65100'
                  }}>
                    {sourceLang?.toUpperCase() || 'ENGLISH'}
                  </Text>
                </View>

                {vocabularyData.map((word) => (
                  <TouchableOpacity
                    key={word.id}
                    style={{
                      backgroundColor: selectedWords[word.id] ? '#e8f5e8' : '#fff',
                      borderWidth: 2,
                      borderColor: selectedWords[word.id] ? '#4caf50' : '#e0e0e0',
                      padding: 16,
                      borderRadius: 12,
                      marginBottom: 12,
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2
                    }}
                    disabled={showAnswers}
                  >
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: selectedWords[word.id] ? '#2e7d32' : '#333'
                    }}>
                      {word.source}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Target Language Column */}
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{
                  backgroundColor: '#e8f5e8',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#2e7d32'
                  }}>
                    {targetLang?.toUpperCase() || 'TURKISH'}
                  </Text>
                </View>

                {vocabularyData.map((word) => {
                  const isSelected = Object.values(selectedWords).includes(word.id);
                  const isCorrectMatch = showAnswers && selectedWords[word.id] === word.id;
                  const isWrongMatch = showAnswers && isSelected && !isCorrectMatch;

                  return (
                    <TouchableOpacity
                      key={word.id}
                      style={{
                        backgroundColor: isCorrectMatch ? '#c8e6c9' :
                                        isWrongMatch ? '#ffcdd2' :
                                        isSelected ? '#bbdefb' : '#fff',
                        borderWidth: 2,
                        borderColor: isCorrectMatch ? '#4caf50' :
                                    isWrongMatch ? '#f44336' :
                                    isSelected ? '#2196f3' : '#e0e0e0',
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 12,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2
                      }}
                      onPress={() => {
                        const sourceId = Object.keys(selectedWords).find(key =>
                          selectedWords[parseInt(key)] === word.id
                        );
                        if (sourceId) {
                          // Deselect if already selected
                          const newSelected = { ...selectedWords };
                          delete newSelected[parseInt(sourceId)];
                          setSelectedWords(newSelected);
                        } else {
                          // Find the last selected source word to match with this target
                          const availableSourceIds = vocabularyData
                            .map(w => w.id)
                            .filter(id => !selectedWords[id]);

                          if (availableSourceIds.length > 0) {
                            handleWordSelection(availableSourceIds[0], word.id);
                          }
                        }
                      }}
                      disabled={showAnswers}
                    >
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: isCorrectMatch ? '#1b5e20' :
                              isWrongMatch ? '#c62828' :
                              isSelected ? '#0d47a1' : '#333'
                      }}>
                        {word.target}
                      </Text>

                      {showAnswers && isCorrectMatch && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#4caf50"
                          style={{ position: 'absolute', top: 4, right: 4 }}
                        />
                      )}

                      {showAnswers && isWrongMatch && (
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#f44336"
                          style={{ position: 'absolute', top: 4, right: 4 }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Action Buttons */}
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
                    opacity: Object.keys(selectedWords).length === vocabularyData.length ? 1 : 0.6
                  }}
                  onPress={checkAnswers}
                  disabled={Object.keys(selectedWords).length !== vocabularyData.length}
                >
                  <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600'
                  }}>
                    Check Answers
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
                    onPress={resetGame}
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
                    onPress={() => router.push('/(tabs)/mainscreen')}
                  >
                    <Text style={{
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: '600'
                    }}>
                      Continue Learning
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}