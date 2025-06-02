import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Colors, GlobalStyles } from '@/constants/Theme';
import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getFlagImage } from '@/utils/helpers';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function LanguageSelectionScreen() {
    const router = useRouter();
    const { setLanguages } = useLanguage();
    const { user } = useAuth();
    const layout = useResponsiveLayout();

    const handleLanguageSelect = (sourceLang: string, targetLang: string) => {
        setLanguages(sourceLang, targetLang);
        router.replace('/(tabs)/mainscreen');
    }

    const containerStyle = layout.isWeb ?
        ResponsiveStyles.webContainer :
        GlobalStyles.container;

    const cardStyle = layout.isWeb ?
        { ...ResponsiveStyles.webCard, minHeight: '90vh' } :
        GlobalStyles.whiteBackgroundContainer;

    const languagePairs = [
        {
            id: 'tr-eng',
            source: 'tr',
            target: 'eng',
            title: 'Turkish to English',
            subtitle: 'Learn English from Turkish',
            color: '#e3f2fd',
            borderColor: '#2196f3'
        },
        {
            id: 'eng-tr',
            source: 'eng',
            target: 'tr',
            title: 'English to Turkish',
            subtitle: 'Learn Turkish from English',
            color: '#f3e5f5',
            borderColor: '#9c27b0'
        },
        {
            id: 'eng-gr',
            source: 'eng',
            target: 'gr',
            title: 'English to German',
            subtitle: 'Learn German from English',
            color: '#fff3e0',
            borderColor: '#ff9800'
        },
        {
            id: 'eng-spn',
            source: 'eng',
            target: 'spn',
            title: 'English to Spanish',
            subtitle: 'Learn Spanish from English',
            color: '#e8f5e8',
            borderColor: '#4caf50'
        },

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
                            Choose Your Language
                        </Text>
                        {user && (
                            <TouchableOpacity
                                style={GlobalStyles.settingsButton}
                                onPress={() => router.push('/(tabs)/settings')}
                            >
                                <Ionicons name="settings-outline" size={24} color="#666" />
                            </TouchableOpacity>
                        )}
                        {!user && <View style={{ width: 24 }} />}
                    </View>

                    <View style={{ paddingHorizontal: layout.isWeb ? 0 : 20 }}>
                        {/* Welcome Message */}
                        <View style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: 16,
                            padding: 20,
                            marginBottom: 30,
                            alignItems: 'center'
                        }}>
                            <Ionicons name="globe-outline" size={48} color={Colors.primary} style={{ marginBottom: 12 }} />
                            <Text style={{
                                fontSize: 20,
                                fontWeight: '600',
                                color: Colors.text,
                                textAlign: 'center',
                                marginBottom: 8
                            }}>
                                Welcome to PolyGlotPal! 🎉
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: '#666',
                                textAlign: 'center',
                                lineHeight: 20
                            }}>
                                Select your learning path below. You can always change this later in settings.
                            </Text>
                        </View>

                        {/* Language Selection Grid */}
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: layout.isWeb ? 16 : 12
                        }}>
                            {languagePairs.map((pair, index) => (
                                <TouchableOpacity
                                    key={pair.id}
                                    style={{
                                        width: layout.isWeb ? 'calc(50% - 8px)' : '48%',
                                        backgroundColor: pair.color,
                                        borderRadius: 16,
                                        padding: 20,
                                        marginBottom: 16,
                                        borderWidth: 2,
                                        borderColor: pair.borderColor,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 8,
                                        elevation: 4
                                    }}
                                    onPress={() => handleLanguageSelect(pair.source, pair.target)}
                                >
                                    {/* Flag Images */}
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 16
                                    }}>
                                        <Image
                                            source={getFlagImage(pair.source) || require('@/assets/images/flags/eng.png')}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20,
                                                borderWidth: 2,
                                                borderColor: '#fff'
                                            }}
                                        />
                                        <Ionicons
                                            name="arrow-forward"
                                            size={20}
                                            color={pair.borderColor}
                                            style={{ marginHorizontal: 12 }}
                                        />
                                        <Image
                                            source={getFlagImage(pair.target) || require('@/assets/images/flags/tr.png')}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20,
                                                borderWidth: 2,
                                                borderColor: '#fff'
                                            }}
                                        />
                                    </View>

                                    {/* Language Info */}
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: Colors.text,
                                        textAlign: 'center',
                                        marginBottom: 4
                                    }}>
                                        {pair.title}
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#666',
                                        textAlign: 'center',
                                        marginBottom: 12
                                    }}>
                                        {pair.subtitle}
                                    </Text>

                                    {/* Start Button */}
                                    <View style={{
                                        backgroundColor: pair.borderColor,
                                        paddingVertical: 8,
                                        paddingHorizontal: 16,
                                        borderRadius: 20,
                                        alignSelf: 'center'
                                    }}>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: 12,
                                            fontWeight: '600'
                                        }}>
                                            Start Learning
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Additional Info */}
                        <View style={{
                            backgroundColor: '#fff3e0',
                            borderRadius: 12,
                            padding: 16,
                            marginTop: 20,
                            borderLeft: '4px solid #ff9800'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 8
                            }}>
                                <Ionicons name="information-circle-outline" size={20} color="#f57c00" />
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#e65100',
                                    marginLeft: 8
                                }}>
                                    Quick Tips
                                </Text>
                            </View>
                            <Text style={{
                                fontSize: 14,
                                color: '#bf360c',
                                lineHeight: 20
                            }}>
                                • Choose the language pair you're most motivated to learn{'\n'}
                                • Start with your native language as the source{'\n'}
                                • You can switch languages anytime in settings{'\n'}
                                • Practice daily for best results! 🚀
                            </Text>
                        </View>

                        {/* Popular Choice Badge */}
                        <View style={{
                            alignItems: 'center',
                            marginTop: 24
                        }}>
                            <View style={{
                                backgroundColor: '#e8f5e8',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Ionicons name="star" size={16} color="#4caf50" />
                                <Text style={{
                                    fontSize: 12,
                                    color: '#2e7d32',
                                    fontWeight: '600',
                                    marginLeft: 4
                                }}>
                                    Most Popular: English ↔ Turkish
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}