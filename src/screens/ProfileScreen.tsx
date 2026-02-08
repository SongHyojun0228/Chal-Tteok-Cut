import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles } from '../constants/mockStyles';

// 목업 유저 데이터 (나중에 Firebase에서 가져옴)
const mockProfile = {
  gender: '여성',
  faceShape: '계란형 (Oval)',
  hairType: '약한 웨이브',
  hairAmount: '보통',
  scalpType: '중성',
  hairLength: '중단발',
  stylingTime: '10분 정도',
  stylePref: '자연스러운',
};

const savedStyleIds = ['style_001', 'style_003'];
const savedStyles = mockStyles.filter((s) => savedStyleIds.includes(s.id));

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>내 프로필</Text>
        <TouchableOpacity style={styles.reanalyzeButton}>
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
          <Text style={styles.faceShape}>{mockProfile.faceShape}</Text>
        </View>
      </View>

      {/* 상세 프로필 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 정보</Text>
        <View style={styles.infoGrid}>
          <InfoItem label="성별" value={mockProfile.gender} emoji="👤" />
          <InfoItem label="모질" value={mockProfile.hairType} emoji="〰️" />
          <InfoItem label="모량" value={mockProfile.hairAmount} emoji="👌" />
          <InfoItem label="두피 타입" value={mockProfile.scalpType} emoji="✨" />
          <InfoItem label="현재 길이" value={mockProfile.hairLength} emoji="💁‍♀️" />
          <InfoItem label="스타일링 시간" value={mockProfile.stylingTime} emoji="⏰" />
          <InfoItem label="선호 스타일" value={mockProfile.stylePref} emoji="🍃" />
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
            <Text style={styles.emptyEmoji}>📌</Text>
            <Text style={styles.emptyText}>아직 저장한 스타일이 없어요</Text>
            <Text style={styles.emptySubtext}>추천 결과에서 마음에 드는 스타일을 저장해보세요</Text>
          </View>
        )}
      </View>

      {/* 히스토리 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 분석 히스토리</Text>
        <View style={styles.historyItem}>
          <View style={styles.historyDot} />
          <View style={styles.historyContent}>
            <Text style={styles.historyDate}>2026년 2월 8일</Text>
            <Text style={styles.historyText}>첫 번째 분석 완료 - 계란형</Text>
          </View>
        </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
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
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginTop: 4,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyDate: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 2,
  },
  historyText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
});
