import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles, StyleData } from '../constants/mockStyles';
import StyleCard from '../components/StyleCard';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/userService';

export default function ResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [filteredStyles, setFilteredStyles] = useState<StyleData[]>(mockStyles);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setLoading(true);
        getUserProfile(user.uid).then((profile) => {
          setUserName(user.displayName || '');

          if (profile) {
            // 성별에 맞는 스타일 필터링
            const gender = profile.gender;
            const filtered = mockStyles.filter(
              (s) => s.gender === 'unisex' || s.gender === gender
            );
            setFilteredStyles(filtered);
          } else {
            setFilteredStyles(mockStyles);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }, [user])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {userName ? `${userName}님을 위한` : '찰떡같이 어울리는'}
        </Text>
        <Text style={styles.title}>맞춤 스타일 추천 ✂️</Text>
        <Text style={styles.subtitle}>
          AI가 분석한 Top {filteredStyles.length} 스타일이에요
        </Text>
      </View>

      {/* 스타일 카드 리스트 */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredStyles.map((item, index) => (
          <View key={item.id}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{index + 1}위</Text>
            </View>
            <StyleCard
              style={item}
              onPress={() => navigation.navigate('StyleDetail', { styleId: item.id })}
            />
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            더 많은 스타일은 곧 업데이트될 예정이에요!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  rankBadge: {
    marginLeft: 28,
    marginBottom: 8,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
