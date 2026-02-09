import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles, StyleData } from '../constants/mockStyles';
import StyleCard from '../components/StyleCard';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/userService';
import { faceShapeNames, FaceDetails } from '../services/faceAnalysisService';
import { getRecommendedStyles } from '../services/recommendationService';
import { FaceShape } from '../types';

export default function ResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [filteredStyles, setFilteredStyles] = useState<StyleData[]>(mockStyles);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [detectedFaceShape, setDetectedFaceShape] = useState<FaceShape | null>(null);
  const [faceDetails, setFaceDetails] = useState<FaceDetails | null>(null);

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

            // 추천 알고리즘으로 점수 계산 + 정렬
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

      {/* 스타일 카드 리스트 */}
      <FlatList
        data={filteredStyles}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        renderItem={({ item, index }) => (
          <View>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{index + 1}위</Text>
            </View>
            <StyleCard
              style={item}
              index={index}
              onPress={() => navigation.navigate('StyleDetail', { styleId: item.id })}
            />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              더 많은 스타일은 곧 업데이트될 예정이에요!
            </Text>
          </View>
        }
      />
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
