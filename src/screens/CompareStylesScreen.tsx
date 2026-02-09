import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles, StyleData } from '../constants/mockStyles';
import styleImages from '../constants/styleImages';

function CompareRow({ label, values }: { label: string; values: React.ReactNode[] }) {
  return (
    <View style={styles.compareRow}>
      <Text style={styles.compareLabel}>{label}</Text>
      <View style={styles.compareValues}>
        {values.map((v, i) => (
          <View key={i} style={[styles.compareCell, { width: `${100 / values.length}%` as any }]}>
            {typeof v === 'string' ? <Text style={styles.compareCellText}>{v}</Text> : v}
          </View>
        ))}
      </View>
    </View>
  );
}

export default function CompareStylesScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'CompareStyles'>>();
  const navigation = useNavigation();
  const styleIds = route.params.styleIds;
  const items = styleIds.map((id) => mockStyles.find((s) => s.id === id)).filter(Boolean) as StyleData[];

  if (items.length < 2) {
    return (
      <View style={styles.emptyContainer}>
        <Text>비교할 스타일이 부족해요</Text>
      </View>
    );
  }

  const count = items.length;

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>스타일 비교</Text>
        <Text style={styles.subtitle}>{count}개 스타일 비교 중</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* 이미지 행 */}
        <View style={styles.imageRow}>
          {items.map((item) => (
            <View key={item.id} style={[styles.imageCol, { width: `${100 / count}%` as any }]}>
              <View style={styles.imageWrapper}>
                {styleImages[item.id] ? (
                  <Image source={styleImages[item.id]} style={styles.compareImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.compareEmoji}>💇</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* 이름 */}
        <CompareRow
          label="스타일"
          values={items.map((item) => (
            <Text key={item.id} style={styles.compareName} numberOfLines={2}>{item.name}</Text>
          ))}
        />

        {/* 매칭 점수 */}
        <CompareRow
          label="매칭 점수"
          values={items.map((item) => (
            <View key={item.id} style={styles.scoreBadge}>
              <Text style={styles.scoreText}>⭐ {item.matchScore}%</Text>
            </View>
          ))}
        />

        {/* 카테고리 */}
        <CompareRow
          label="카테고리"
          values={items.map((item) => item.category)}
        />

        {/* 얼굴형 */}
        <CompareRow
          label="얼굴형"
          values={items.map((item) => (
            <View key={item.id} style={styles.chipWrap}>
              {item.faceShapes.slice(0, 3).map((fs) => (
                <View key={fs} style={styles.miniChip}>
                  <Text style={styles.miniChipText}>{fs}</Text>
                </View>
              ))}
            </View>
          ))}
        />

        {/* 모질 */}
        <CompareRow
          label="모질"
          values={items.map((item) => (
            <View key={item.id} style={styles.chipWrap}>
              {(item.hairTypes || []).map((ht) => (
                <View key={ht} style={styles.miniChip}>
                  <Text style={styles.miniChipText}>{ht === 'straight' ? '직모' : ht === 'wavy' ? '웨이브' : '곱슬'}</Text>
                </View>
              ))}
            </View>
          ))}
        />

        {/* 난이도 */}
        <CompareRow
          label="난이도"
          values={items.map((item) => (
            <Text key={item.id} style={styles.difficultyText}>
              {'★'.repeat(item.difficulty)}{'☆'.repeat(3 - item.difficulty)}
            </Text>
          ))}
        />

        {/* 스타일링 시간 */}
        <CompareRow
          label="스타일링"
          values={items.map((item) => `${item.maintenanceTime}분`)}
        />

        {/* 가격 */}
        <CompareRow
          label="가격대"
          values={items.map((item) => item.priceRange)}
        />

        {/* 유지 기간 */}
        <CompareRow
          label="유지 기간"
          values={items.map((item) => item.duration)}
        />

        {/* 태그 */}
        <CompareRow
          label="태그"
          values={items.map((item) => (
            <View key={item.id} style={styles.chipWrap}>
              {item.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>#{tag}</Text>
                </View>
              ))}
            </View>
          ))}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // 이미지 행
  imageRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 16,
    gap: 8,
  },
  imageCol: {
    paddingHorizontal: 4,
  },
  imageWrapper: {
    height: 160,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compareImage: {
    width: '100%',
    height: 240,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  compareEmoji: {
    fontSize: 40,
  },
  // 비교 행
  compareRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  compareLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
    marginBottom: 8,
  },
  compareValues: {
    flexDirection: 'row',
  },
  compareCell: {
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  compareCellText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  compareName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  scoreBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
  difficultyText: {
    fontSize: 14,
    color: Colors.accent,
    letterSpacing: 2,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  miniChip: {
    backgroundColor: '#F0F9FF',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  miniChipText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  tagChip: {
    backgroundColor: '#FFF1F2',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tagChipText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
});
