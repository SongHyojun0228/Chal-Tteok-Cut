import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';

type SettingItemProps = {
  emoji: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
};

function SettingItem({ emoji, title, subtitle, onPress, rightElement, danger }: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <Text style={styles.settingEmoji}>{emoji}</Text>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (onPress && <Text style={styles.settingArrow}>›</Text>)}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  // 스타일 제안 폼 상태
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionName, setSuggestionName] = useState('');
  const [suggestionDesc, setSuggestionDesc] = useState('');
  const [suggestionUrl, setSuggestionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const suggestionAnim = useState(new Animated.Value(0))[0];

  const openSuggestionModal = () => {
    setShowSuggestion(true);
    Animated.spring(suggestionAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const closeSuggestionModal = () => {
    Animated.timing(suggestionAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setShowSuggestion(false);
      setSuggestionName('');
      setSuggestionDesc('');
      setSuggestionUrl('');
    });
  };

  const handleSubmitSuggestion = async () => {
    if (!suggestionName.trim()) {
      Alert.alert('알림', '스타일 이름을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'suggestions'), {
        styleName: suggestionName.trim(),
        description: suggestionDesc.trim() || null,
        referenceUrl: suggestionUrl.trim() || null,
        userId: user?.uid || null,
        createdAt: serverTimestamp(),
      });
      closeSuggestionModal();
      Alert.alert('감사합니다!', '소중한 제안이 접수되었어요.\n검토 후 반영하겠습니다.');
    } catch {
      Alert.alert('오류', '제출에 실패했어요. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => signOut(auth),
      },
    ]);
  };

  const handleReanalyze = () => {
    Alert.alert(
      '재분석 방법 선택',
      '어떤 방식으로 재분석할까요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '사진만 다시 찍기',
          onPress: () => navigation.navigate('ProfileFlow', { mode: 'photoOnly' }),
        },
        {
          text: '전체 다시하기',
          onPress: () => navigation.navigate('ProfileFlow', { mode: 'full' }),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말 탈퇴하시겠어요?\n모든 데이터가 삭제되며 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴하기', style: 'destructive' },
      ]
    );
  };

  const handleDeletePhotos = () => {
    Alert.alert(
      '얼굴 사진 삭제',
      '저장된 얼굴 사진을 모두 삭제하시겠어요?\n재분석 시 다시 촬영이 필요합니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제하기', style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>설정</Text>
      </View>

      {/* 계정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>계정</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            emoji="👤"
            title={user?.displayName || '사용자'}
            subtitle={user?.email || ''}
          />
        </View>
      </View>

      {/* 프로필 관리 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>프로필 관리</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            emoji="🔄"
            title="프로필 재분석"
            subtitle="사진만 또는 전체를 다시 진행해요"
            onPress={handleReanalyze}
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="🗑️"
            title="얼굴 사진 삭제"
            subtitle="저장된 사진을 모두 삭제합니다"
            onPress={handleDeletePhotos}
          />
        </View>
      </View>

      {/* 알림 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>알림</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            emoji="🔔"
            title="푸시 알림"
            subtitle="새로운 스타일 추천 알림"
            rightElement={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ true: Colors.primary }}
              />
            }
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="📢"
            title="마케팅 알림"
            subtitle="이벤트, 할인 정보"
            rightElement={
              <Switch
                value={marketingEnabled}
                onValueChange={setMarketingEnabled}
                trackColor={{ true: Colors.primary }}
              />
            }
          />
        </View>
      </View>

      {/* 고객지원 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>고객지원</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            emoji="❓"
            title="자주 묻는 질문"
            onPress={() => navigation.navigate('FAQ')}
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="💬"
            title="문의하기"
            subtitle={`이메일: thdgywns2300@gmail.com\n카카오톡: hyojun2300`}
            onPress={() => Linking.openURL('mailto:thdgywns2300@gmail.com')}
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="⭐"
            title="앱 리뷰 남기기"
            onPress={() => Alert.alert('감사합니다!', '앱스토어로 이동합니다 (준비 중)')}
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="💡"
            title="스타일 제안하기"
            subtitle="원하는 스타일을 알려주세요"
            onPress={openSuggestionModal}
          />
        </View>
      </View>

      {/* 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>정보</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            emoji="📄"
            title="이용약관"
            onPress={() => navigation.navigate('Legal', { type: 'terms' })}
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="🔒"
            title="개인정보 처리방침"
            onPress={() => navigation.navigate('Legal', { type: 'privacy' })}
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="📱"
            title="앱 버전"
            rightElement={<Text style={styles.versionText}>1.0.0 (MVP)</Text>}
          />
        </View>
      </View>

      {/* 위험 영역 */}
      <View style={styles.section}>
        <View style={styles.sectionCard}>
          <SettingItem
            emoji="🚪"
            title="로그아웃"
            onPress={handleLogout}
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="⚠️"
            title="회원 탈퇴"
            danger
            onPress={handleDeleteAccount}
          />
        </View>
      </View>

      {/* 하단 로고 */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>✂️ 찰떡컷</Text>
        <Text style={styles.footerText}>찰떡같이 어울리는 헤어컷</Text>
      </View>

      {/* 스타일 제안 모달 */}
      <Modal visible={showSuggestion} transparent animationType="none" onRequestClose={closeSuggestionModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeSuggestionModal}>
            <Animated.View
              style={[
                styles.suggestionModal,
                {
                  transform: [{ scale: suggestionAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
                  opacity: suggestionAnim,
                },
              ]}
            >
              <TouchableOpacity activeOpacity={1}>
                <Text style={styles.suggestionTitle}>💡 스타일 제안하기</Text>
                <Text style={styles.suggestionSubtitle}>원하는 스타일을 알려주시면 검토 후 추가할게요</Text>

                <Text style={styles.inputLabel}>스타일 이름 *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="예: 허쉬컷, 빌드펌 등"
                  placeholderTextColor={Colors.disabled}
                  value={suggestionName}
                  onChangeText={setSuggestionName}
                  maxLength={50}
                />

                <Text style={styles.inputLabel}>설명 (선택)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="어떤 스타일인지 간단히 설명해주세요"
                  placeholderTextColor={Colors.disabled}
                  value={suggestionDesc}
                  onChangeText={setSuggestionDesc}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />

                <Text style={styles.inputLabel}>참고 URL (선택)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="참고 이미지나 영상 링크"
                  placeholderTextColor={Colors.disabled}
                  value={suggestionUrl}
                  onChangeText={setSuggestionUrl}
                  keyboardType="url"
                  autoCapitalize="none"
                  maxLength={500}
                />

                <View style={styles.suggestionButtons}>
                  <TouchableOpacity style={styles.suggestionCancelBtn} onPress={closeSuggestionModal}>
                    <Text style={styles.suggestionCancelText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.suggestionSubmitBtn, !suggestionName.trim() && styles.suggestionSubmitDisabled]}
                    onPress={handleSubmitSuggestion}
                    disabled={submitting || !suggestionName.trim()}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <Text style={styles.suggestionSubmitText}>제출하기</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    marginBottom: 10,
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingEmoji: {
    fontSize: 22,
    marginRight: 14,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  settingArrow: {
    fontSize: 22,
    color: Colors.textLight,
  },
  dangerText: {
    color: Colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 52,
  },
  versionText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 13,
    color: Colors.disabled,
  },
  // 스타일 제안 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionModal: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    width: '88%',
  },
  suggestionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  suggestionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  suggestionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  suggestionCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  suggestionCancelText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  suggestionSubmitBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  suggestionSubmitDisabled: {
    opacity: 0.5,
  },
  suggestionSubmitText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
