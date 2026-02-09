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
  Image,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles } from '../constants/mockStyles';
import styleImages from '../constants/styleImages';
import { styleHeadShapeData, headShapeLabels } from '../constants/headShapeData';
import { styleHairTypeData, hairTypeLabels, hairAmountLabels } from '../constants/hairTypeData';
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
  const qrCardRef = useRef<any>(null);

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

  const shareAsImage = async () => {
    if (!qrCardRef.current) return;
    try {
      const uri = await captureRef(qrCardRef, {
        format: 'png',
        quality: 1,
      });
      await Share.share({ url: uri });
    } catch {
      Alert.alert('공유 실패', '이미지 캡처에 실패했어요. 다시 시도해주세요.');
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
        {styleImages[item.id] ? (
          <Image source={styleImages[item.id]} style={styles.detailImage} resizeMode="cover" />
        ) : (
          <Text style={styles.imagePlaceholder}>💇</Text>
        )}
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

      {/* 어울리는 두상 */}
      {styleHeadShapeData[item.id] && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧠 어울리는 두상</Text>
          <View style={styles.headShapeBox}>
            <Text style={styles.headShapeRec}>
              {styleHeadShapeData[item.id].recommendation}
            </Text>
            <View style={styles.headShapeTags}>
              {styleHeadShapeData[item.id].suitableHeadShapes.backHeadShape.map((v) => (
                <View key={`bh_${v}`} style={styles.headShapeTag}>
                  <Text style={styles.headShapeTagText}>{headShapeLabels.backHeadShape[v]}</Text>
                </View>
              ))}
              {styleHeadShapeData[item.id].suitableHeadShapes.crownHeight.map((v) => (
                <View key={`ch_${v}`} style={styles.headShapeTag}>
                  <Text style={styles.headShapeTagText}>{headShapeLabels.crownHeight[v]}</Text>
                </View>
              ))}
              {styleHeadShapeData[item.id].suitableHeadShapes.headSize.map((v) => (
                <View key={`hs_${v}`} style={styles.headShapeTag}>
                  <Text style={styles.headShapeTagText}>머리 {headShapeLabels.headSize[v]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 모질/모량 가이드 */}
      {styleHairTypeData[item.id] && (() => {
        const hd = styleHairTypeData[item.id];
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💇 모질/모량 가이드</Text>
            <View style={styles.hairTypeBox}>
              <Text style={styles.hairTypeNote}>{hd.hairTypeNote}</Text>
              <View style={styles.hairTypeMeta}>
                <View style={styles.hairTypeRow}>
                  <Text style={styles.hairTypeLabel}>베스트 모질</Text>
                  <View style={styles.bestBadge}>
                    <Text style={styles.bestBadgeText}>{hairTypeLabels[hd.bestHairType]}</Text>
                  </View>
                </View>
                <View style={styles.hairTypeRow}>
                  <Text style={styles.hairTypeLabel}>적합 모질</Text>
                  <View style={styles.hairTypeTags}>
                    {hd.suitableHairTypes.map((t) => (
                      <View key={t} style={styles.hairTypeTag}>
                        <Text style={styles.hairTypeTagText}>{hairTypeLabels[t]}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.hairTypeRow}>
                  <Text style={styles.hairTypeLabel}>적합 모량</Text>
                  <View style={styles.hairTypeTags}>
                    {hd.suitableHairAmounts.map((a) => (
                      <View key={a} style={styles.hairTypeTag}>
                        <Text style={styles.hairTypeTagText}>{hairAmountLabels[a]}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              {hd.notRecommendedFor && (
                <View style={styles.notRecBox}>
                  <Text style={styles.notRecText}>⚠️ {hd.notRecommendedFor.reason}</Text>
                </View>
              )}
            </View>
          </View>
        );
      })()}

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
              {/* 캡처 영역 */}
              <View ref={qrCardRef} collapsable={false} style={styles.qrCard}>
                {/* 상단: 썸네일 + 스타일 정보 */}
                <View style={styles.qrCardHeader}>
                  <View style={styles.qrThumbnail}>
                    {styleImages[item.id] ? (
                      <Image source={styleImages[item.id]} style={styles.qrThumbnailImage} resizeMode="cover" />
                    ) : (
                      <Text style={styles.qrThumbnailEmoji}>💇</Text>
                    )}
                  </View>
                  <View style={styles.qrCardInfo}>
                    <Text style={styles.qrStyleName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.qrMatchScore}>⭐ {item.matchScore}% 매칭</Text>
                    {userFaceShape && (
                      <Text style={styles.qrFaceShape}>
                        얼굴형: {faceShapeNames[userFaceShape]}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.qrDivider} />

                {/* QR 코드 */}
                <View style={styles.qrContainer}>
                  <QRCode
                    value={qrData}
                    size={160}
                    color={Colors.textPrimary}
                    backgroundColor={Colors.white}
                  />
                </View>

                {/* 메타 정보 */}
                <View style={styles.qrMetaRow}>
                  <View style={styles.qrMetaItem}>
                    <Text style={styles.qrMetaLabel}>카테고리</Text>
                    <Text style={styles.qrMetaValue}>{item.category}</Text>
                  </View>
                  <View style={styles.qrMetaSep} />
                  <View style={styles.qrMetaItem}>
                    <Text style={styles.qrMetaLabel}>난이도</Text>
                    <Text style={styles.qrMetaValue}>
                      {'★'.repeat(item.difficulty)}{'☆'.repeat(3 - item.difficulty)}
                    </Text>
                  </View>
                  <View style={styles.qrMetaSep} />
                  <View style={styles.qrMetaItem}>
                    <Text style={styles.qrMetaLabel}>가격</Text>
                    <Text style={styles.qrMetaValue}>{item.priceRange}</Text>
                  </View>
                </View>

                <View style={styles.qrDivider} />

                {/* 브랜딩 */}
                <View style={styles.qrBranding}>
                  <Text style={styles.qrBrandingText}>✂️ 찰떡컷으로 분석한 결과입니다</Text>
                </View>
              </View>

              {/* 하단 버튼 (캡처 영역 바깥) */}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.imageShareButton} onPress={shareAsImage}>
                  <Text style={styles.imageShareText}>🖼️ 이미지로 저장</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkShareButton} onPress={shareLink}>
                  <Text style={styles.linkShareText}>🔗 링크 공유</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={closeQRModal}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
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
    height: 480,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  detailImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 600,
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
  hairTypeBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  hairTypeNote: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 14,
  },
  hairTypeMeta: {
    gap: 10,
  },
  hairTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hairTypeLabel: {
    fontSize: 13,
    color: Colors.textLight,
    width: 72,
  },
  bestBadge: {
    backgroundColor: '#F59E0B',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  bestBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  hairTypeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hairTypeTag: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  hairTypeTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
  },
  notRecBox: {
    marginTop: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
  },
  notRecText: {
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 20,
  },
  headShapeBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  headShapeRec: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 14,
  },
  headShapeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  headShapeTag: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  headShapeTagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1D4ED8',
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
  // QR Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    width: '88%',
    alignItems: 'center',
  },
  // QR Card (캡처 영역)
  qrCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qrCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrThumbnail: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  qrThumbnailImage: {
    width: 72,
    height: 110,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  qrThumbnailEmoji: {
    fontSize: 32,
  },
  qrCardInfo: {
    flex: 1,
  },
  qrStyleName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  qrMatchScore: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 2,
  },
  qrFaceShape: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  qrDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  qrMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  qrMetaItem: {
    alignItems: 'center',
    flex: 1,
  },
  qrMetaLabel: {
    fontSize: 11,
    color: Colors.textLight,
    marginBottom: 2,
  },
  qrMetaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  qrMetaSep: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  qrBranding: {
    alignItems: 'center',
  },
  qrBrandingText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  // Modal Buttons
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'stretch',
    marginTop: 16,
  },
  imageShareButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  imageShareText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  linkShareButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  linkShareText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  closeButton: {
    alignSelf: 'stretch',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: Colors.textLight,
    fontSize: 15,
    fontWeight: '600',
  },
});
