import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles, StyleData } from '../constants/mockStyles';
import styleImages from '../constants/styleImages';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/userService';
import { faceShapeNames, FaceDetails } from '../services/faceAnalysisService';
import { getRecommendedStyles } from '../services/recommendationService';
import { FaceShape } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.78;
const CARD_SPACING = 12;
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export default function ResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [filteredStyles, setFilteredStyles] = useState<StyleData[]>(mockStyles);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [detectedFaceShape, setDetectedFaceShape] = useState<FaceShape | null>(null);
  const [faceDetails, setFaceDetails] = useState<FaceDetails | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setLoading(true);
        getUserProfile(user.uid).then((profile) => {
          setUserName(user.displayName || '');

          if (profile) {
            const faceShape = profile.faceShape as FaceShape | undefined;
            if (faceShape) setDetectedFaceShape(faceShape);
            if (profile.faceAnalysis?.details) setFaceDetails(profile.faceAnalysis.details);

            const recommended = getRecommendedStyles(mockStyles, profile);
            setFilteredStyles(recommended);
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

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const onMomentumScrollEnd = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
    setActiveIndex(idx);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderCard = ({ item, index }: { item: StyleData; index: number }) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + CARD_SPACING),
      index * (CARD_WIDTH + CARD_SPACING),
      (index + 1) * (CARD_WIDTH + CARD_SPACING),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.88, 1, 0.88],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.cardWrapper, { width: CARD_WIDTH, transform: [{ scale }], opacity }]}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('StyleDetail', { styleId: item.id })}
          activeOpacity={0.9}
        >
          {/* 랭크 배지 */}
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{index + 1}위</Text>
          </View>

          {/* 매칭 점수 배지 */}
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreIcon}>⭐</Text>
            <Text style={styles.scoreText}>{item.matchScore}% 매칭</Text>
          </View>

          {/* 이미지 영역 */}
          <View style={styles.imageArea}>
            {styleImages[item.id] ? (
              <Image source={styleImages[item.id]} style={styles.image} resizeMode="cover" />
            ) : (
              <Text style={styles.imagePlaceholder}>💇</Text>
            )}
            <View style={styles.categoryBadge}>
              <Text style={styles.imageLabel}>{item.category}</Text>
            </View>
          </View>

          {/* 정보 영역 */}
          <View style={styles.info}>
            <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.reason} numberOfLines={2}>{item.reason}</Text>

            {/* 메타 정보 */}
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>난이도</Text>
                <Text style={styles.metaValue}>
                  {'★'.repeat(item.difficulty)}{'☆'.repeat(3 - item.difficulty)}
                </Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>시간</Text>
                <Text style={styles.metaValue}>{item.maintenanceTime}분</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>가격</Text>
                <Text style={styles.metaValue}>{item.priceRange}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {userName ? `${userName}님을 위한` : '찰떡같이 어울리는'}
        </Text>
        <Text style={styles.title}>맞춤 스타일 추천 ✂️</Text>
        {detectedFaceShape ? (
          <View>
            <Text style={styles.subtitle}>
              얼굴형: {faceShapeNames[detectedFaceShape]} | Top {filteredStyles.length} 스타일
            </Text>
            {faceDetails?.overallImpression && faceDetails.overallImpression !== '균형 잡힌 얼굴형' && (
              <Text style={styles.impression}>{faceDetails.overallImpression}</Text>
            )}
          </View>
        ) : (
          <Text style={styles.subtitle}>
            AI가 분석한 Top {filteredStyles.length} 스타일이에요
          </Text>
        )}
        <TouchableOpacity
          style={styles.allStylesButton}
          onPress={() => navigation.navigate('AllStyles')}
        >
          <Text style={styles.allStylesText}>전체 스타일 보기 →</Text>
        </TouchableOpacity>
      </View>

      {/* 캐러셀 */}
      <Animated.FlatList
        data={filteredStyles}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: SIDE_SPACING,
          paddingRight: SIDE_SPACING,
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={renderCard}
        style={styles.carousel}
      />

      {/* 페이지네이션 점 */}
      <View style={styles.pagination}>
        {filteredStyles.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* 하단 요약 */}
      {filteredStyles[activeIndex] && (
        <View style={styles.bottomSummary}>
          <Text style={styles.summaryName}>{filteredStyles[activeIndex].name}</Text>
          <Text style={styles.summaryDesc} numberOfLines={1}>
            {filteredStyles[activeIndex].reason}
          </Text>
        </View>
      )}

      <View style={styles.footerSpacer} />
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
    paddingBottom: 16,
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
  impression: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  allStylesButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allStylesText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  // 캐러셀
  carousel: {
    flexGrow: 0,
  },
  cardWrapper: {
    marginRight: CARD_SPACING,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  rankBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  scoreBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  scoreIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
  imageArea: {
    height: 300,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 400,
  },
  imagePlaceholder: {
    fontSize: 56,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  imageLabel: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
  info: {
    padding: 16,
  },
  cardName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  reason: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 10,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  metaLabel: {
    fontSize: 10,
    color: Colors.textLight,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  // 페이지네이션
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  // 하단 요약
  bottomSummary: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  summaryName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  summaryDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footerSpacer: {
    height: 16,
  },
});
