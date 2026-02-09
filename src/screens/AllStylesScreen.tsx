import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles, StyleData } from '../constants/mockStyles';

type FilterType = '전체' | '여성' | '남성';
type CategoryType = '전체' | '숏컷' | '단발' | '중단발' | '미디엄' | '긴머리';

const GENDER_FILTERS: FilterType[] = ['전체', '여성', '남성'];
const CATEGORY_FILTERS: CategoryType[] = ['전체', '숏컷', '단발', '중단발', '미디엄', '긴머리'];

function MiniStyleCard({ item, onPress }: { item: StyleData; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.miniCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.miniImageArea}>
        <Text style={styles.miniEmoji}>💇</Text>
      </View>
      <View style={styles.miniInfo}>
        <View style={styles.miniHeader}>
          <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.miniScoreBadge}>
            <Text style={styles.miniScoreText}>⭐ {item.matchScore}%</Text>
          </View>
        </View>
        <Text style={styles.miniCategory}>{item.category} · {item.gender === 'male' ? '남성' : '여성'}</Text>
        <Text style={styles.miniDesc} numberOfLines={1}>{item.reason}</Text>
        <View style={styles.miniMeta}>
          <Text style={styles.miniMetaText}>
            {'★'.repeat(item.difficulty)}{'☆'.repeat(3 - item.difficulty)} · {item.maintenanceTime}분 · {item.priceRange}
          </Text>
        </View>
      </View>
      <Text style={styles.miniArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function AllStylesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [genderFilter, setGenderFilter] = useState<FilterType>('전체');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('전체');

  const filteredStyles = useMemo(() => {
    return mockStyles.filter((s) => {
      if (genderFilter === '여성' && s.gender !== 'female') return false;
      if (genderFilter === '남성' && s.gender !== 'male') return false;
      if (categoryFilter !== '전체' && s.category !== categoryFilter) return false;
      return true;
    });
  }, [genderFilter, categoryFilter]);

  // 현재 필터에 해당하는 카테고리만 활성화
  const availableCategories = useMemo(() => {
    const filtered = genderFilter === '전체'
      ? mockStyles
      : mockStyles.filter((s) =>
          genderFilter === '여성' ? s.gender === 'female' : s.gender === 'male'
        );
    const cats = new Set(filtered.map((s) => s.category));
    return CATEGORY_FILTERS.filter((c) => c === '전체' || cats.has(c));
  }, [genderFilter]);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>전체 스타일</Text>
        <Text style={styles.subtitle}>{filteredStyles.length}개의 스타일</Text>
      </View>

      {/* 성별 필터 */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {GENDER_FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, genderFilter === f && styles.filterChipActive]}
              onPress={() => {
                setGenderFilter(f);
                setCategoryFilter('전체');
              }}
            >
              <Text style={[styles.filterChipText, genderFilter === f && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 카테고리 필터 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {availableCategories.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.categoryChip, categoryFilter === c && styles.categoryChipActive]}
              onPress={() => setCategoryFilter(c)}
            >
              <Text style={[styles.categoryChipText, categoryFilter === c && styles.categoryChipTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 스타일 리스트 */}
      <FlatList
        data={filteredStyles}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        renderItem={({ item }) => (
          <MiniStyleCard
            item={item}
            onPress={() => navigation.navigate('StyleDetail', { styleId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>해당 조건의 스타일이 없어요</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 12,
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
  filterSection: {
    backgroundColor: Colors.white,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  categoryChipActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF1F2',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textLight,
  },
  categoryChipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  miniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  miniImageArea: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  miniEmoji: {
    fontSize: 28,
  },
  miniInfo: {
    flex: 1,
  },
  miniHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  miniName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  miniScoreBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  miniScoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },
  miniCategory: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  miniDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  miniMeta: {
    flexDirection: 'row',
  },
  miniMetaText: {
    fontSize: 11,
    color: Colors.textLight,
  },
  miniArrow: {
    fontSize: 22,
    color: Colors.textLight,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textLight,
  },
});
