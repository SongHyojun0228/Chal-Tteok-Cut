import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { ProfileFlowParamList } from '../types';

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
  const [currentStep, setCurrentStep] = useState(0);
  const pulseAnim = new Animated.Value(1);

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

    // 단계별 진행
    const timers: NodeJS.Timeout[] = [];
    steps.forEach((_, index) => {
      if (index > 0) {
        timers.push(
          setTimeout(() => setCurrentStep(index), index * 1200)
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

      {/* 프로그레스 도트 */}
      <View style={styles.dots}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index <= currentStep && styles.dotActive,
            ]}
          />
        ))}
      </View>

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
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  caption: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
