import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Colors } from '../constants/colors';

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
  const [pushEnabled, setPushEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const handleReanalyze = () => {
    Alert.alert(
      '프로필 재분석',
      '사진과 질문을 다시 진행하시겠어요?\n기존 분석 결과는 히스토리에 저장됩니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '재분석하기', style: 'default' },
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
            title="로그인 / 회원가입"
            subtitle="데이터를 안전하게 보관하세요"
            onPress={() => Alert.alert('준비 중', '곧 로그인 기능이 추가될 예정이에요!')}
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
            subtitle="사진과 질문을 다시 진행해요"
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
            onPress={() => Alert.alert('FAQ', '준비 중이에요!')}
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="💬"
            title="문의하기"
            subtitle="이메일로 문의해주세요"
            onPress={() => Alert.alert('문의', 'support@chaltteok.com')}
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="⭐"
            title="앱 리뷰 남기기"
            onPress={() => Alert.alert('감사합니다!', '앱스토어로 이동합니다 (준비 중)')}
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
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingItem
            emoji="🔒"
            title="개인정보 처리방침"
            onPress={() => {}}
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
            onPress={() => Alert.alert('로그아웃', '로그인 후 사용 가능합니다')}
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
});
