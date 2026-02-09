import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');

const isIOS = Platform.OS === 'web' && /iPad|iPhone|iPod/.test(navigator?.userAgent || '');

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StepCard({ num, emoji, title, desc }: { num: number; emoji: string; title: string; desc: string }) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNum}><Text style={styles.stepNumText}>{num}</Text></View>
      <Text style={styles.stepEmoji}>{emoji}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDesc}>{desc}</Text>
    </View>
  );
}

function FeatureCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  );
}

export default function LandingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const ctaScale = useRef(new Animated.Value(1)).current;

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>✂️</Text>
        <Text style={styles.heroTitle}>
          <Text style={styles.accent}>찰떡</Text>같이{'\n'}어울리는 헤어컷
        </Text>
        <Text style={styles.heroSubtitle}>
          AI가 얼굴형과 모질을 분석해서{'\n'}나에게 딱 맞는 헤어스타일을 추천해드려요
        </Text>

        <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={goToLogin}
            onPressIn={() => Animated.spring(ctaScale, { toValue: 0.95, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(ctaScale, { toValue: 1, useNativeDriver: true }).start()}
          >
            <Text style={styles.ctaText}>무료로 시작하기</Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.heroNote}>회원가입 후 3분이면 추천받을 수 있어요</Text>

        <View style={styles.stats}>
          <StatItem number="58+" label="스타일 DB" />
          <StatItem number="5가지" label="얼굴형 분석" />
          <StatItem number="3분" label="소요시간" />
        </View>
      </View>

      {/* How it works */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
        <Text style={styles.sectionTitle}>3단계로 끝나는 스타일 추천</Text>
        <View style={styles.stepsRow}>
          <StepCard num={1} emoji="📸" title="사진 촬영" desc={'정면 사진 한 장이면 충분해요.\n갤러리에서 선택도 OK!'} />
          <StepCard num={2} emoji="📝" title="간단한 질문" desc={'모질, 모량, 선호 스타일 등\n6개 질문에 답해주세요'} />
          <StepCard num={3} emoji="✨" title="맞춤 추천" desc={'AI가 분석한 나만의\nTop 스타일을 확인하세요'} />
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>FEATURES</Text>
        <Text style={styles.sectionTitle}>이런 기능이 있어요</Text>
        <View style={styles.featuresGrid}>
          <FeatureCard emoji="🧠" title="AI 얼굴형 분석" desc="Google Vision AI가 32개 포인트로 얼굴을 분석. 이마, 광대, 턱선까지 정밀 측정!" />
          <FeatureCard emoji="⚖️" title="스타일 비교" desc="마음에 드는 2~3개 스타일을 골라 나란히 비교. 난이도, 가격, 매칭 점수 한눈에!" />
          <FeatureCard emoji="📱" title="QR 공유" desc="추천 스타일을 QR 카드로 만들어 미용사에게 보여주세요. 상담 시간 절약!" />
          <FeatureCard emoji="🔄" title="간편 재분석" desc="사진만 다시 찍거나 전체를 다시 분석. 헤어 바꿀 때마다 새로운 추천!" />
        </View>
      </View>

      {/* Install Guide (웹에서만) */}
      {Platform.OS === 'web' && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INSTALL</Text>
          <Text style={styles.sectionTitle}>📲 앱으로 설치하기</Text>
          <View style={styles.installBox}>
            {isIOS ? (
              <>
                <InstallStep num={1} text='Safari로 이 페이지 접속' />
                <InstallStep num={2} text='하단 공유 버튼 (□↑) 탭' />
                <InstallStep num={3} text='"홈 화면에 추가" 선택' />
                <InstallStep num={4} text='"추가" 탭하면 완료!' />
                <View style={styles.installNote}>
                  <Text style={styles.installNoteText}>⚠️ 반드시 Safari에서 해야 해요</Text>
                </View>
              </>
            ) : (
              <>
                <InstallStep num={1} text='Chrome으로 이 페이지 접속' />
                <InstallStep num={2} text='우측 상단 메뉴(⋮) 탭' />
                <InstallStep num={3} text='"홈 화면에 추가" 또는 "앱 설치" 선택' />
                <InstallStep num={4} text='"추가" 탭하면 완료!' />
              </>
            )}
          </View>
        </View>
      )}

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <Text style={styles.bottomCtaTitle}>지금 바로 시작해보세요</Text>
        <Text style={styles.bottomCtaDesc}>무료로 나에게 어울리는 스타일을 찾아보세요</Text>
        <TouchableOpacity style={styles.ctaButton} onPress={goToLogin}>
          <Text style={styles.ctaText}>찰떡컷 시작하기</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>✂️ 찰떡컷</Text>
        <Text style={styles.footerSub}>Made with Claude</Text>
      </View>
    </ScrollView>
  );
}

function InstallStep({ num, text }: { num: number; text: string }) {
  return (
    <View style={styles.installStep}>
      <View style={styles.installStepNum}>
        <Text style={styles.installStepNumText}>{num}</Text>
      </View>
      <Text style={styles.installStepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 0,
  },
  // Hero
  hero: {
    paddingTop: 80,
    paddingBottom: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  accent: {
    color: Colors.primary,
  },
  heroSubtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  heroNote: {
    marginTop: 14,
    fontSize: 14,
    color: Colors.textLight,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 4,
  },
  // Section
  section: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    color: Colors.textPrimary,
    marginBottom: 32,
  },
  // Steps
  stepsRow: {
    gap: 16,
  },
  stepCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepNumText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  stepEmoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Features
  featuresGrid: {
    gap: 14,
  },
  featureCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  // Install
  installBox: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  installStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  installStepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  installStepNumText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  installStepText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  installNote: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  installNoteText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
  },
  // Bottom CTA
  bottomCta: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  bottomCtaTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  bottomCtaDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 28,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textLight,
  },
  footerSub: {
    fontSize: 12,
    color: Colors.disabled,
    marginTop: 4,
  },
});
