import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { ProfileFlowParamList } from '../types';
import { analyzeFaceShape, faceShapeNames } from '../services/faceAnalysisService';
import { updateFaceAnalysis } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<ProfileFlowParamList, 'Analyzing'>;
};

const steps = [
  { emoji: '📸', text: '사진 분석 중...' },
  { emoji: '📐', text: '얼굴형 측정 중...' },
  { emoji: '🔍', text: '스타일 매칭 중...' },
  { emoji: '✨', text: '추천 준비 완료!' },
];

export default function AnalyzingScreen({ navigation }: Props) {
  const route = useRoute<RouteProp<ProfileFlowParamList, 'Analyzing'>>();
  const { user } = useAuth();
  const storagePath = route.params?.storagePath;
  const photoOnly = route.params?.photoOnly || false;
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<{
    shapeName: string;
    impression: string;
    confidence: number;
  } | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const analysisStarted = useRef(false);

  useEffect(() => {
    // 펄스 애니메이션
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 얼굴형 분석 시작 (사진이 있는 경우)
    if (storagePath && !analysisStarted.current) {
      analysisStarted.current = true;
      analyzeFaceShape(storagePath)
        .then(async (result) => {
          setAnalysisResult({
            shapeName: faceShapeNames[result.faceShape],
            impression: result.details.overallImpression,
            confidence: result.confidence,
          });
          console.log('얼굴형 분석 결과:', result);

          // photoOnly 모드: 질문 답변은 유지하고 얼굴 분석만 업데이트
          if (photoOnly && user) {
            try {
              await updateFaceAnalysis(user.uid, result.faceShape, result);
              console.log('얼굴 분석만 업데이트 완료');
            } catch (e) {
              console.log('얼굴 분석 업데이트 실패:', e);
            }
          }
        })
        .catch((error) => {
          console.log('얼굴형 분석 실패 (질문 기반으로 진행):', error);
        });
    }

    // 단계별 진행 (UI 애니메이션)
    const timers: NodeJS.Timeout[] = [];
    steps.forEach((_, index) => {
      if (index > 0) {
        timers.push(
          setTimeout(() => {
            setCurrentStep(index);
            Animated.timing(progressAnim, {
              toValue: index / (steps.length - 1),
              duration: 300,
              useNativeDriver: false,
            }).start();
          }, index * 1200)
        );
      }
    });

    // 마지막 단계 후 결과 화면으로 이동
    timers.push(
      setTimeout(() => {
        navigation.getParent()?.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as never }],
        });
      }, steps.length * 1200)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const step = steps[currentStep];

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.emoji, { transform: [{ scale: pulseAnim }] }]}
      >
        {step.emoji}
      </Animated.Text>

      <Text style={styles.title}>AI가 분석하고 있어요</Text>
      <Text style={styles.stepText}>{step.text}</Text>

      {/* 분석 결과 미리보기 */}
      {analysisResult && currentStep >= 2 && (
        <View style={styles.resultPreview}>
          <Text style={styles.resultText}>얼굴형: {analysisResult.shapeName}</Text>
          {analysisResult.impression && analysisResult.impression !== '균형 잡힌 얼굴형' && (
            <Text style={styles.resultImpression}>{analysisResult.impression}</Text>
          )}
          <Text style={styles.resultConfidence}>
            정확도 {Math.round(analysisResult.confidence * 100)}%
          </Text>
        </View>
      )}

      {/* 프로그레스 바 */}
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['5%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {currentStep + 1} / {steps.length}
      </Text>

      <Text style={styles.caption}>잠시만 기다려주세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  stepText: {
    fontSize: 17,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 40,
  },
  resultPreview: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.success,
  },
  resultImpression: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  resultConfidence: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  progressBar: {
    width: 200,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 24,
  },
  caption: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
