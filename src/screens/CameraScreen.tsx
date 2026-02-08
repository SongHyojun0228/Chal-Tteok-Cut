import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { ProfileFlowParamList } from '../types';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<ProfileFlowParamList, 'Camera'>;
};

export default function CameraScreen({ navigation }: Props) {
  const handleCapture = () => {
    // TODO: 실제 카메라 촬영 연동
    // 지금은 바로 질문 화면으로 이동
    navigation.navigate('Questions');
  };

  return (
    <View style={styles.container}>
      {/* 상단 안내 */}
      <View style={styles.header}>
        <Text style={styles.step}>STEP 1/2</Text>
        <Text style={styles.title}>정면 사진을 촬영해주세요</Text>
        <Text style={styles.description}>
          얼굴형 분석을 위해 정면 사진이 필요해요
        </Text>
      </View>

      {/* 카메라 프리뷰 영역 (placeholder) */}
      <View style={styles.cameraArea}>
        {/* 얼굴 가이드라인 오버레이 */}
        <View style={styles.faceGuide}>
          <Text style={styles.guideEmoji}>🧑</Text>
          <Text style={styles.guideText}>여기에 얼굴을 맞춰주세요</Text>
        </View>
      </View>

      {/* 촬영 팁 */}
      <View style={styles.tips}>
        <Text style={styles.tipItem}>💡 밝은 곳에서 촬영해주세요</Text>
        <Text style={styles.tipItem}>💡 정면을 바라봐주세요</Text>
        <Text style={styles.tipItem}>💡 머리카락으로 얼굴을 가리지 마세요</Text>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
        <Text style={styles.captureLabel}>촬영</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  step: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cameraArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: width * 0.6,
    height: width * 0.8,
    borderRadius: width * 0.3,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  guideText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  tips: {
    backgroundColor: Colors.background,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 4,
  },
  tipItem: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  footer: {
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingBottom: 48,
    paddingTop: 12,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
  },
  captureLabel: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
