import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { StyleData } from '../constants/mockStyles';

type Props = {
  style: StyleData;
  onPress: () => void;
};

function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <Text style={starStyles.stars}>
      {'★'.repeat(level)}
      {'☆'.repeat(3 - level)}
    </Text>
  );
}

const starStyles = StyleSheet.create({
  stars: { fontSize: 14, color: Colors.accent, letterSpacing: 2 },
});

export default function StyleCard({ style: item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* 상단: 매칭 점수 배지 */}
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreIcon}>⭐</Text>
        <Text style={styles.scoreText}>{item.matchScore}% 매칭</Text>
      </View>

      {/* 이미지 placeholder */}
      <View style={styles.imageArea}>
        <Text style={styles.imagePlaceholder}>💇</Text>
        <Text style={styles.imageLabel}>{item.category}</Text>
      </View>

      {/* 정보 영역 */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.reason} numberOfLines={2}>{item.reason}</Text>

        {/* 메타 정보 */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>관리 난이도</Text>
            <DifficultyStars level={item.difficulty} />
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>스타일링</Text>
            <Text style={styles.metaValue}>{item.maintenanceTime}분</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>가격대</Text>
            <Text style={styles.metaValue}>{item.priceRange}</Text>
          </View>
        </View>

        {/* 태그 */}
        <View style={styles.tags}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  scoreBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  scoreIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accent,
  },
  imageArea: {
    height: 200,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 64,
  },
  imageLabel: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textLight,
  },
  info: {
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  reason: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  metaLabel: {
    fontSize: 11,
    color: Colors.textLight,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFF1F2',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
});
