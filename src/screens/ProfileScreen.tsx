import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles } from '../constants/mockStyles';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, UserProfile, answerLabels } from '../services/userService';

function getLabel(key: string, value: string): string {
  return answerLabels[key]?.[value] || value || '-';
}

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 화면에 포커스 올 때마다 최신 데이터 불러오기
  useFocusEffect(
    useCallback(() => {
      if (user) {
        setLoading(true);
        getUserProfile(user.uid)
          .then(setProfile)
          .finally(() => setLoading(false));
      }
    }, [user])
  );

  const savedStyles = profile?.savedStyles
    ? mockStyles.filter((s) => profile.savedStyles.includes(s.id))
    : [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // 프로필 미생성 시
  if (!profile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🧑</Text>
        <Text style={styles.emptyTitle}>아직 프로필이 없어요</Text>
        <Text style={styles.emptyDesc}>
          사진 촬영과 간단한 질문으로{'\n'}나에게 딱 맞는 스타일을 찾아보세요
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('ProfileFlow')}
        >
          <Text style={styles.createButtonText}>프로필 만들기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const faceShapeLabel = profile.faceShape === 'unknown'
    ? '분석 대기 중'
    : getLabel('face_shape', profile.faceShape || '');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>내 프로필</Text>
          {user?.displayName && (
            <Text style={styles.userName}>{user.displayName}님</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.reanalyzeButton}
          onPress={() => navigation.navigate('ProfileFlow')}
        >
          <Text style={styles.reanalyzeText}>🔄 재분석</Text>
        </TouchableOpacity>
      </View>

      {/* 얼굴형 분석 결과 카드 */}
      <View style={styles.faceCard}>
        <View style={styles.faceIconArea}>
          <Text style={styles.faceIcon}>🧑</Text>
        </View>
        <View style={styles.faceInfo}>
          <Text style={styles.faceLabel}>내 얼굴형</Text>
          <Text style={styles.faceShape}>{faceShapeLabel}</Text>
        </View>
      </View>

      {/* 상세 프로필 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 정보</Text>
        <View style={styles.infoGrid}>
          <InfoItem label="성별" value={getLabel('gender', profile.gender)} emoji="👤" />
          <InfoItem label="모질" value={getLabel('hair_type', profile.hairType)} emoji="〰️" />
          <InfoItem label="모량" value={getLabel('hair_amount', profile.hairAmount)} emoji="👌" />
          <InfoItem label="두피 타입" value={getLabel('scalp_type', profile.scalpType)} emoji="✨" />
          <InfoItem label="현재 길이" value={getLabel('hair_length', profile.hairLength)} emoji="💁" />
          <InfoItem label="스타일링 시간" value={getLabel('styling_time', profile.stylingTime)} emoji="⏰" />
          <InfoItem label="선호 스타일" value={getLabel('style_pref', profile.stylePref)} emoji="🍃" />
        </View>
      </View>

      {/* 저장한 스타일 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❤️ 저장한 스타일</Text>
        {savedStyles.length > 0 ? (
          savedStyles.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.savedCard}
              onPress={() => navigation.navigate('StyleDetail', { styleId: item.id })}
            >
              <View style={styles.savedImageArea}>
                <Text style={styles.savedEmoji}>💇</Text>
              </View>
              <View style={styles.savedInfo}>
                <Text style={styles.savedName}>{item.name}</Text>
                <Text style={styles.savedCategory}>{item.category}</Text>
                <View style={styles.savedMeta}>
                  <Text style={styles.savedScore}>⭐ {item.matchScore}%</Text>
                  <Text style={styles.savedDifficulty}>
                    {'★'.repeat(item.difficulty)}{'☆'.repeat(3 - item.difficulty)}
                  </Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📌</Text>
            <Text style={styles.emptyStateText}>아직 저장한 스타일이 없어요</Text>
            <Text style={styles.emptyStateSubtext}>추천 결과에서 마음에 드는 스타일을 저장해보세요</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function InfoItem({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoEmoji}>{emoji}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userName: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  reanalyzeButton: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reanalyzeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  faceCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  faceIconArea: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  faceIcon: {
    fontSize: 36,
  },
  faceInfo: {
    flex: 1,
  },
  faceLabel: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 4,
  },
  faceShape: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  infoItem: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoEmoji: {
    fontSize: 20,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  savedImageArea: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  savedEmoji: {
    fontSize: 28,
  },
  savedInfo: {
    flex: 1,
  },
  savedName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  savedCategory: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 6,
  },
  savedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savedScore: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
  savedDifficulty: {
    fontSize: 12,
    color: Colors.accent,
  },
  arrow: {
    fontSize: 24,
    color: Colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
