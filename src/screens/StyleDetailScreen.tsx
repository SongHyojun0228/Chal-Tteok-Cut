import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles } from '../constants/mockStyles';

export default function StyleDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'StyleDetail'>>();
  const item = mockStyles.find((s) => s.id === route.params.styleId);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>스타일을 찾을 수 없어요</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 이미지 영역 */}
      <View style={styles.imageArea}>
        <Text style={styles.imagePlaceholder}>💇</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>⭐ {item.matchScore}% 매칭</Text>
        </View>
      </View>

      {/* 기본 정보 */}
      <View style={styles.section}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* 추천 이유 */}
      <View style={styles.reasonBox}>
        <Text style={styles.reasonTitle}>💡 추천 이유</Text>
        <Text style={styles.reasonText}>{item.reason}</Text>
      </View>

      {/* 상세 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>상세 정보</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>관리 난이도</Text>
            <Text style={styles.infoValue}>
              {'★'.repeat(item.difficulty)}{'☆'.repeat(3 - item.difficulty)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>스타일링 시간</Text>
            <Text style={styles.infoValue}>{item.maintenanceTime}분</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>예상 가격</Text>
            <Text style={styles.infoValue}>{item.priceRange}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>유지 기간</Text>
            <Text style={styles.infoValue}>{item.duration}</Text>
          </View>
        </View>
      </View>

      {/* 관리 방법 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏠 홈케어 팁</Text>
        {item.careTips.map((tip, index) => (
          <View key={index} style={styles.tipRow}>
            <Text style={styles.tipNumber}>{index + 1}</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* 태그 */}
      <View style={styles.section}>
        <View style={styles.tags}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>❤️ 이 스타일 저장</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>📤 미용사와 공유</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 48,
  },
  imageArea: {
    height: 280,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 80,
  },
  scoreBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  category: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  reasonBox: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  reasonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
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
    gap: 12,
  },
  infoItem: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFF1F2',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  buttons: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 12,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  shareButton: {
    backgroundColor: Colors.white,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  shareButtonText: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: '700',
  },
});
