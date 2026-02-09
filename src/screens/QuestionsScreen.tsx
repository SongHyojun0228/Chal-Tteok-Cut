import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { ProfileFlowParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { saveUserProfile } from '../services/userService';

type Props = {
  navigation: NativeStackNavigationProp<ProfileFlowParamList, 'Questions'>;
};

type Question = {
  id: string;
  title: string;
  subtitle: string;
  options: { label: string; value: string; emoji: string }[];
  skipable?: boolean; // "모르겠어요" 표시 여부
};

// 성별 질문 (첫 번째, "모르겠어요" 없음)
const genderQuestion: Question = {
  id: 'gender',
  title: '성별을 알려주세요',
  subtitle: '성별에 맞는 스타일을 추천해드릴게요',
  options: [
    { label: '남성', value: 'male', emoji: '👨' },
    { label: '여성', value: 'female', emoji: '👩' },
  ],
  skipable: false,
};

// 공통 질문
const commonQuestions: Question[] = [
  {
    id: 'hair_type',
    title: '모질이 어떻게 되세요?',
    subtitle: '자연 상태의 머릿결을 알려주세요',
    options: [
      { label: '직모', value: 'straight', emoji: '📏' },
      { label: '약한 웨이브', value: 'wavy', emoji: '〰️' },
      { label: '강한 곱슬', value: 'curly', emoji: '🌀' },
    ],
  },
  {
    id: 'hair_amount',
    title: '모량은 어느 정도인가요?',
    subtitle: '머리카락의 전체적인 양을 알려주세요',
    options: [
      { label: '적음', value: 'thin', emoji: '🪶' },
      { label: '보통', value: 'medium', emoji: '👌' },
      { label: '많음', value: 'thick', emoji: '🦁' },
    ],
  },
  {
    id: 'scalp_type',
    title: '두피 타입은요?',
    subtitle: '샴푸 후 하루 지난 상태 기준으로',
    options: [
      { label: '지성', value: 'oily', emoji: '💧' },
      { label: '중성', value: 'normal', emoji: '✨' },
      { label: '건성', value: 'dry', emoji: '🏜️' },
    ],
  },
];

// 성별에 따른 머리 길이 질문
const hairLengthMale: Question = {
  id: 'hair_length',
  title: '현재 머리 길이는?',
  subtitle: '지금 기준으로 알려주세요',
  options: [
    { label: '스포츠컷/크루컷', value: 'buzz', emoji: '💈' },
    { label: '숏컷 (귀 안 덮임)', value: 'short', emoji: '✂️' },
    { label: '미디엄 (귀 덮임)', value: 'medium', emoji: '💇‍♂️' },
    { label: '장발 (어깨 이상)', value: 'long', emoji: '🧔' },
  ],
};

const hairLengthFemale: Question = {
  id: 'hair_length',
  title: '현재 머리 길이는?',
  subtitle: '지금 기준으로 알려주세요',
  options: [
    { label: '초단발 (귀 위)', value: 'very_short', emoji: '✂️' },
    { label: '단발 (턱선)', value: 'short', emoji: '💇‍♀️' },
    { label: '중단발 (어깨)', value: 'medium', emoji: '💁‍♀️' },
    { label: '긴머리 (가슴 이상)', value: 'long', emoji: '👩‍🦰' },
  ],
};

// 두상 관련 질문
const headShapeQuestions: Question[] = [
  {
    id: 'back_head',
    title: '뒷통수가 어떤가요?',
    subtitle: '옆에서 봤을 때 뒷머리 형태를 알려주세요',
    options: [
      { label: '둥글고 볼록함', value: 'round', emoji: '🟠' },
      { label: '평평함 (절벽)', value: 'flat', emoji: '📐' },
    ],
  },
  {
    id: 'crown_height',
    title: '정수리 높이는요?',
    subtitle: '정면에서 봤을 때 머리 윗부분',
    options: [
      { label: '높은 편', value: 'high', emoji: '⬆️' },
      { label: '보통', value: 'medium', emoji: '➡️' },
      { label: '낮은 편 (납작)', value: 'low', emoji: '⬇️' },
    ],
  },
  {
    id: 'head_size',
    title: '머리 크기는 어떤가요?',
    subtitle: '모자 쓸 때 기준으로',
    options: [
      { label: '작은 편', value: 'small', emoji: '🧢' },
      { label: '보통', value: 'medium', emoji: '👌' },
      { label: '큰 편', value: 'large', emoji: '🎩' },
    ],
  },
];

// 나머지 공통 질문
const lastQuestions: Question[] = [
  {
    id: 'styling_time',
    title: '아침에 머리하는 데\n얼마나 쓰시나요?',
    subtitle: '스타일링 시간 기준',
    options: [
      { label: '5분 이하', value: 'under_5', emoji: '⚡' },
      { label: '10분 정도', value: 'about_10', emoji: '⏰' },
      { label: '20분 이상', value: 'over_20', emoji: '🎨' },
    ],
  },
  {
    id: 'style_pref',
    title: '어떤 느낌의 스타일을\n원하세요?',
    subtitle: '가장 끌리는 스타일을 골라주세요',
    options: [
      { label: '자연스러운', value: 'natural', emoji: '🍃' },
      { label: '트렌디한', value: 'trendy', emoji: '🔥' },
      { label: '개성있는', value: 'unique', emoji: '⭐' },
    ],
  },
];

export default function QuestionsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const route = useRoute<RouteProp<ProfileFlowParamList, 'Questions'>>();
  const storagePath = route.params?.storagePath;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // 성별에 따라 질문 리스트 동적 구성
  const questions = useMemo(() => {
    const gender = answers['gender'];
    const hairLength = gender === 'male' ? hairLengthMale : hairLengthFemale;
    return [genderQuestion, ...commonQuestions, hairLength, ...headShapeQuestions, ...lastQuestions];
  }, [answers['gender']]);

  const question = questions[currentQ];
  const totalQuestions = questions.length;
  const progress = (currentQ + 1) / totalQuestions;
  const showSkip = question.skipable !== false;

  const goNextOrFinish = async (newAnswers: Record<string, string>) => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // 마지막 질문 → Firestore에 저장 후 분석 화면으로
      if (user) {
        try {
          await saveUserProfile(user.uid, newAnswers);
        } catch (error) {
          Alert.alert('저장 오류', '데이터 저장에 실패했어요. 다시 시도해주세요.');
          return;
        }
      }
      navigation.navigate('Analyzing', { storagePath });
    }
  };

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    setTimeout(() => goNextOrFinish(newAnswers), 300);
  };

  const handleSkip = () => {
    const newAnswers = { ...answers, [question.id]: 'unknown' };
    setAnswers(newAnswers);
    setTimeout(() => goNextOrFinish(newAnswers), 300);
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 */}
      <View style={styles.header}>
        <Text style={styles.step}>STEP 2/2</Text>
        <Text style={styles.questionCount}>
          질문 {currentQ + 1} / {totalQuestions}
        </Text>
      </View>

      {/* 프로그레스 바 */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* 질문 카드 */}
      <ScrollView style={styles.questionCard} contentContainerStyle={styles.questionContent}>
        <Text style={styles.title}>{question.title}</Text>
        <Text style={styles.subtitle}>{question.subtitle}</Text>

        <View style={styles.options}>
          {question.options.map((option) => {
            const isSelected = answers[question.id] === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionSelected,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* 모르겠어요 버튼 */}
          {showSkip && (
            <TouchableOpacity
              style={[
                styles.skipOptionButton,
                answers[question.id] === 'unknown' && styles.skipOptionSelected,
              ]}
              onPress={handleSkip}
            >
              <Text style={styles.skipOptionEmoji}>🤷</Text>
              <Text
                style={[
                  styles.skipOptionLabel,
                  answers[question.id] === 'unknown' && styles.skipOptionLabelSelected,
                ]}
              >
                모르겠어요
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* 이전 버튼 */}
      {currentQ > 0 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>← 이전 질문</Text>
        </TouchableOpacity>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  step: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  questionCount: {
    fontSize: 13,
    color: Colors.textLight,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    marginTop: 16,
    marginHorizontal: 24,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  questionCard: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questionContent: {
    paddingTop: 48,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 40,
  },
  options: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF5F5',
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
  skipOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  skipOptionSelected: {
    borderColor: Colors.textLight,
    backgroundColor: '#F9FAFB',
  },
  skipOptionEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  skipOptionLabel: {
    fontSize: 15,
    color: Colors.textLight,
  },
  skipOptionLabelSelected: {
    color: Colors.textSecondary,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  backText: {
    fontSize: 15,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
