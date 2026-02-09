import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const FAQ_ITEMS = [
  {
    question: '찰떡컷은 어떤 앱인가요?',
    answer:
      '찰떡컷은 AI가 얼굴형, 모질, 선호도를 분석해서 나에게 딱 맞는 헤어스타일을 추천해주는 앱이에요. 미용실 가기 전에 어울리는 스타일을 미리 확인할 수 있어요.',
  },
  {
    question: '얼굴형 분석은 어떻게 이루어지나요?',
    answer:
      '정면 사진을 촬영하면 Google Cloud Vision AI가 얼굴의 32개 랜드마크(눈, 코, 턱선 등)를 추출하고, 이마/광대/턱 비율을 계산해서 5가지 얼굴형(둥근형, 계란형, 각진형, 긴형, 역삼각형) 중 하나로 분류해요.',
  },
  {
    question: '분석 결과가 정확한가요?',
    answer:
      'AI 분석은 참고용이에요. 조명, 각도, 표정에 따라 결과가 달라질 수 있어요. 결과가 마음에 들지 않으면 설정에서 재분석하거나, 미용사와 상담 시 참고자료로 활용해보세요.',
  },
  {
    question: '사진은 어떻게 관리되나요?',
    answer:
      '촬영한 사진은 암호화되어 Firebase Storage에 저장되며, 본인만 접근할 수 있어요. 설정 > 얼굴 사진 삭제에서 언제든 삭제할 수 있고, 회원 탈퇴 시 모든 데이터가 즉시 삭제됩니다.',
  },
  {
    question: '프로필을 다시 분석할 수 있나요?',
    answer:
      '네! 프로필 화면 상단의 "재분석" 버튼이나 설정 > 프로필 재분석에서 언제든 다시 분석할 수 있어요. 새로운 사진으로 더 정확한 결과를 받아보세요.',
  },
  {
    question: '추천 스타일이 마음에 안 들면?',
    answer:
      '추천 결과는 AI 기반이라 100% 만족하지 못할 수 있어요. 다른 조건(모질, 선호도 등)으로 재분석하거나, 추천 결과를 미용사에게 공유해서 상담 시 참고해보세요.',
  },
  {
    question: '앱 사용 요금이 있나요?',
    answer:
      '현재 모든 기능을 무료로 이용할 수 있어요. 향후 프리미엄 기능이 추가될 수 있지만, 기본 분석과 추천은 계속 무료로 제공될 예정이에요.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity style={styles.faqItem} onPress={toggle} activeOpacity={0.7}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Text style={styles.faqArrow}>{expanded ? '−' : '+'}</Text>
      </View>
      {expanded && <Text style={styles.faqAnswer}>{answer}</Text>}
    </TouchableOpacity>
  );
}

export default function FAQScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>자주 묻는 질문</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {FAQ_ITEMS.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            원하는 답변을 찾지 못하셨나요?{'\n'}
            설정 > 문의하기로 연락해주세요.
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  faqItem: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginRight: 12,
  },
  faqArrow: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textLight,
  },
  faqAnswer: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});
