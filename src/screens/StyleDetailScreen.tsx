import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Share,
  Animated,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles } from '../constants/mockStyles';
import { useAuth } from '../contexts/AuthContext';
import { toggleSavedStyle, getUserProfile } from '../services/userService';
import { faceShapeNames } from '../services/faceAnalysisService';
import { FaceShape } from '../types';

export default function StyleDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'StyleDetail'>>();
  const { user } = useAuth();
  const item = mockStyles.find((s) => s.id === route.params.styleId);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [userFaceShape, setUserFaceShape] = useState<FaceShape | null>(null);
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user && item) {
      getUserProfile(user.uid).then((profile) => {
        if (profile?.savedStyles?.includes(item.id)) {
          setIsSaved(true);
        }
        if (profile?.faceShape) {
          setUserFaceShape(profile.faceShape as FaceShape);
        }
      });
    }
  }, [user, item]);

  const openQRModal = () => {
    setShowQR(true);
    Animated.spring(modalAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const closeQRModal = () => {
    Animated.timing(modalAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setShowQR(false);
    });
  };

  const shareLink = async () => {
    if (!item) return;
    const shareData = [
      `찰떡컷 - ${item.name}`,
      `매칭 점수: ${item.matchScore}%`,
      userFaceShape ? `얼굴형: ${faceShapeNames[userFaceShape]}` : '',
      `카테고리: ${item.category}`,
      `관리 난이도: ${'★'.repeat(item.difficulty)}${'☆'.repeat(3 - item.difficulty)}`,
      `예상 가격: ${item.priceRange}`,
      '',
      `추천 이유: ${item.reason}`,
      '',
      '찰떡컷 앱에서 확인하세요!',
    ].filter(Boolean).join('\n');

    try {
      await Share.share({ message: shareData });
    } catch {
      Alert.alert('공유 실패', '다시 시도해주세요.');
    }
  };

  // QR에 담을 데이터
  const qrData = item ? JSON.stringify({
    app: 'chaltteok-cut',
    styleId: item.id,
    styleName: item.name,
    matchScore: item.matchScore,
    faceShape: userFaceShape || 'unknown',
    category: item.category,
    difficulty: item.difficulty,
  }) : '';

  const handleSave = async () => {
    if (!user || !item) return;
    setSaving(true);
    try {
      const saved = await toggleSavedStyle(user.uid, item.id);
      setIsSaved(saved);
      Alert.alert(
        saved ? '저장 완료' : '저장 해제',
        saved ? '프로필에서 확인할 수 있어요!' : '저장 목록에서 제거했어요'
      );
    } catch {
      Alert.alert('오류', '저장에 실패했어요. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

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
        <TouchableOpacity
          style={[styles.saveButton, isSaved && styles.saveButtonSaved]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextSaved]}>
            {saving ? '저장 중...' : isSaved ? '💔 저장 해제' : '❤️ 이 스타일 저장'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={openQRModal}>
          <Text style={styles.shareButtonText}>📤 미용사와 공유</Text>
        </TouchableOpacity>
      </View>

      {/* QR 공유 모달 */}
      <Modal visible={showQR} transparent animationType="none" onRequestClose={closeQRModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeQRModal}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
                opacity: modalAnim,
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <Text style={styles.modalTitle}>미용사에게 보여주세요</Text>
              <Text style={styles.modalSubtitle}>{item.name} | {item.matchScore}% 매칭</Text>

              <View style={styles.qrContainer}>
                <QRCode value={qrData} size={200} color={Colors.textPrimary} backgroundColor={Colors.white} />
              </View>

              {userFaceShape && (
                <View style={styles.faceShapeBadge}>
                  <Text style={styles.faceShapeBadgeText}>
                    얼굴형: {faceShapeNames[userFaceShape]}
                  </Text>
                </View>
              )}

              <View style={styles.modalInfo}>
                <Text style={styles.modalInfoText}>카테고리: {item.category}</Text>
                <Text style={styles.modalInfoText}>난이도: {'★'.repeat(item.difficulty)}{'☆'.repeat(3 - item.difficulty)}</Text>
                <Text style={styles.modalInfoText}>가격: {item.priceRange}</Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.shareLinkButton} onPress={shareLink}>
                  <Text style={styles.shareLinkText}>링크로 공유</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={closeQRModal}>
                  <Text style={styles.closeButtonText}>닫기</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
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
  saveButtonSaved: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.textLight,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  saveButtonTextSaved: {
    color: Colors.textSecondary,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 28,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  faceShapeBadge: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  faceShapeBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  modalInfo: {
    alignSelf: 'stretch',
    gap: 6,
    marginBottom: 20,
  },
  modalInfoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'stretch',
  },
  shareLinkButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareLinkText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  closeButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
});
