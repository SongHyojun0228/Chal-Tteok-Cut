import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { ProfileFlowParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { uploadFacePhoto } from '../services/storageService';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<ProfileFlowParamList, 'Camera'>;
};

export default function CameraScreen({ navigation }: Props) {
  const route = useRoute<RouteProp<ProfileFlowParamList, 'Camera'>>();
  const mode = route.params?.mode || 'full';
  const { user } = useAuth();
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '카메라 권한을 허용해주세요');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '갤러리 접근 권한을 허용해주세요');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    let storagePath: string | undefined;
    if (photo && user) {
      setUploading(true);
      try {
        const result = await uploadFacePhoto(user.uid, photo);
        storagePath = result.storagePath;
      } catch {
        // 업로드 실패해도 진행 (사진은 선택사항)
        console.log('사진 업로드 실패');
      } finally {
        setUploading(false);
      }
    }
    if (mode === 'photoOnly') {
      navigation.navigate('Analyzing', { storagePath, photoOnly: true });
    } else {
      navigation.navigate('Questions', { storagePath });
    }
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

      {/* 사진 영역 */}
      <View style={styles.photoArea}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.preview} />
        ) : (
          <View style={styles.faceGuide}>
            <Text style={styles.guideEmoji}>🧑</Text>
            <Text style={styles.guideText}>여기에 얼굴을 맞춰주세요</Text>
          </View>
        )}
      </View>

      {/* 촬영 팁 */}
      <View style={styles.tips}>
        <Text style={styles.tipItem}>💡 밝은 곳에서 촬영해주세요</Text>
        <Text style={styles.tipItem}>💡 정면을 바라봐주세요</Text>
        <Text style={styles.tipItem}>💡 머리카락으로 얼굴을 가리지 마세요</Text>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        {photo ? (
          // 사진 있음 → 다음 or 재촬영
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.retakeButton} onPress={() => setPhoto(null)}>
              <Text style={styles.retakeText}>다시 찍기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={uploading}>
              <Text style={styles.nextText}>{uploading ? '업로드 중...' : '다음으로'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // 사진 없음 → 촬영/갤러리
          <View style={styles.captureActions}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
              <Text style={styles.galleryEmoji}>🖼️</Text>
              <Text style={styles.galleryText}>갤러리</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
              <Text style={styles.skipEmoji}>⏭️</Text>
              <Text style={styles.skipText}>건너뛰기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  photoArea: {
    flex: 1,
    marginHorizontal: 24,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  faceGuide: {
    width: width * 0.5,
    height: width * 0.65,
    borderRadius: width * 0.25,
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 4,
  },
  tipItem: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 8,
  },
  captureActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  galleryButton: {
    alignItems: 'center',
    width: 64,
  },
  galleryEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  galleryText: {
    fontSize: 12,
    color: Colors.textSecondary,
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
  skipButton: {
    alignItems: 'center',
    width: 64,
  },
  skipEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  skipText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  retakeText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  nextButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
