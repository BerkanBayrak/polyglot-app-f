import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Colors, GlobalStyles } from '@/constants/Theme';
import { ResponsiveStyles } from '@/constants/ResponsiveTheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { user, loading } = useAuth();
    const { sourceLang, targetLang } = useLanguage();
    const router = useRouter();
    const layout = useResponsiveLayout();
    const [name, setName] = useState('');
    const [email, setEmail] = useState(user?.email || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Mock user stats - in real app, this would come from API
    const [userStats] = useState({
        lessonsCompleted: 24,
        wordsLearned: 156,
        dayStreak: 7,
        totalXP: 1240,
        level: 3,
        joinDate: new Date().toLocaleDateString()
    });

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

    const handleSave = () => {
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
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
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={[
                            GlobalStyles.headerText,
                            layout.isWeb && ResponsiveStyles.webTitle
                        ]}>
                            Profile
                        </Text>
                        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                            <Ionicons
                                name={isEditing ? "checkmark" : "create-outline"}
                                size={24}
                                color="#007AFF"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingHorizontal: layout.isWeb ? 0 : 20 }}>
                        {/* Profile Header */}
                        <View style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: 20,
                            padding: 24,
                            marginBottom: 24,
                            alignItems: 'center'
                        }}>
                            <View style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: Colors.primary + '20',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 16,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4
                            }}>
                                <Ionicons name="person" size={50} color={Colors.primary} />
                            </View>

                            <Text style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                color: Colors.text,
                                marginBottom: 4
                            }}>
                                {user?.email?.split('@')[0] || 'User'}
                            </Text>

                            <View style={{
                                backgroundColor: Colors.primary + '20',
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 20,
                                marginBottom: 8
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: Colors.primary
                                }}>
                                    Level {userStats.level}
                                </Text>
                            </View>

                            <Text style={{
                                fontSize: 16,
                                color: '#666',
                                marginBottom: 16
                            }}>
                                Learning {sourceLang?.toUpperCase()} → {targetLang?.toUpperCase()}
                            </Text>

                            {/* XP Bar */}
                            <View style={{
                                width: '100%',
                                backgroundColor: '#e0e0e0',
                                height: 8,
                                borderRadius: 4,
                                overflow: 'hidden',
                                marginBottom: 8
                            }}>
                                <View style={{
                                    backgroundColor: Colors.primary,
                                    height: '100%',
                                    width: '65%',
                                    borderRadius: 4
                                }} />
                            </View>

                            <Text style={{
                                fontSize: 12,
                                color: '#666'
                            }}>
                                {userStats.totalXP} XP • 350 XP to next level
                            </Text>
                        </View>

                        {/* Stats Grid */}
                        <View style={{
                            marginBottom: 24
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                color: Colors.text,
                                marginBottom: 16
                            }}>
                                Learning Progress
                            </Text>

                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                gap: 12
                            }}>
                                {[
                                    {
                                        icon: 'book-outline',
                                        label: 'Lessons',
                                        value: userStats.lessonsCompleted,
                                        color: '#4caf50'
                                    },
                                    {
                                        icon: 'library-outline',
                                        label: 'Words',
                                        value: userStats.wordsLearned,
                                        color: '#2196f3'
                                    },
                                    {
                                        icon: 'flame-outline',
                                        label: 'Day Streak',
                                        value: userStats.dayStreak,
                                        color: '#ff9800'
                                    },
                                    {
                                        icon: 'star-outline',
                                        label: 'Total XP',
                                        value: userStats.totalXP,
                                        color: '#9c27b0'
                                    }
                                ].map((stat, index) => (
                                    <View key={index} style={{
                                        width: layout.isWeb ? 'calc(50% - 6px)' : '48%',
                                        backgroundColor: '#fff',
                                        borderRadius: 12,
                                        padding: 16,
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: '#f0f0f0',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 2
                                    }}>
                                        <View style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            backgroundColor: stat.color + '20',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 8
                                        }}>
                                            <Ionicons name={stat.icon} size={20} color={stat.color} />
                                        </View>
                                        <Text style={{
                                            fontSize: 24,
                                            fontWeight: 'bold',
                                            color: stat.color,
                                            marginBottom: 4
                                        }}>
                                            {stat.value}
                                        </Text>
                                        <Text style={{
                                            fontSize: 12,
                                            color: '#666',
                                            textAlign: 'center'
                                        }}>
                                            {stat.label}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Profile Form */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                color: Colors.text,
                                marginBottom: 16
                            }}>
                                Personal Information
                            </Text>

                            <View style={{
                                backgroundColor: '#fff',
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: '#f0f0f0',
                                overflow: 'hidden'
                            }}>
                                <View style={{
                                    padding: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#f0f0f0'
                                }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: Colors.text,
                                        marginBottom: 8
                                    }}>
                                        Full Name
                                    </Text>
                                    <TextInput
                                        style={{
                                            fontSize: 16,
                                            color: isEditing ? Colors.text : '#666',
                                            backgroundColor: isEditing ? '#f8f9fa' : 'transparent',
                                            padding: isEditing ? 12 : 0,
                                            borderRadius: isEditing ? 8 : 0,
                                            borderWidth: isEditing ? 1 : 0,
                                            borderColor: '#e0e0e0'
                                        }}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Enter your full name"
                                        editable={isEditing}
                                    />
                                </View>

                                <View style={{
                                    padding: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#f0f0f0'
                                }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: Colors.text,
                                        marginBottom: 8
                                    }}>
                                        Email Address
                                    </Text>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#666'
                                    }}>
                                        {email}
                                    </Text>
                                </View>

                                <View style={{ padding: 16 }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: Colors.text,
                                        marginBottom: 8
                                    }}>
                                        Member Since
                                    </Text>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#666'
                                    }}>
                                        {userStats.joinDate}
                                    </Text>
                                </View>
                            </View>

                            {isEditing && (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: Colors.primary,
                                        padding: 16,
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        marginTop: 16
                                    }}
                                    onPress={handleSave}
                                >
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: 16,
                                        fontWeight: '600'
                                    }}>
                                        Save Changes
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Achievements */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                color: Colors.text,
                                marginBottom: 16
                            }}>
                                Recent Achievements
                            </Text>

                            <View style={{
                                backgroundColor: '#fff',
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: '#f0f0f0',
                                overflow: 'hidden'
                            }}>
                                {[
                                    { icon: 'medal-outline', title: 'First Lesson', desc: 'Completed your first lesson', color: '#ffc107' },
                                    { icon: 'trophy-outline', title: 'Week Warrior', desc: '7-day learning streak', color: '#ff9800' },
                                    { icon: 'star-outline', title: 'Word Master', desc: 'Learned 100+ words', color: '#9c27b0' }
                                ].map((achievement, index, array) => (
                                    <View key={index} style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 16,
                                        borderBottomWidth: index < array.length - 1 ? 1 : 0,
                                        borderBottomColor: '#f0f0f0'
                                    }}>
                                        <View style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            backgroundColor: achievement.color + '20',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 12
                                        }}>
                                            <Ionicons name={achievement.icon} size={20} color={achievement.color} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: '600',
                                                color: Colors.text,
                                                marginBottom: 2
                                            }}>
                                                {achievement.title}
                                            </Text>
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#666'
                                            }}>
                                                {achievement.desc}
                                            </Text>
                                        </View>
                                        <Ionicons name="checkmark-circle" size={20} color="#4caf50" />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}