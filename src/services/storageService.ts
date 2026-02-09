import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export interface UploadResult {
  downloadURL: string;
  storagePath: string;
}

/**
 * 이미지를 압축해서 Firebase Storage에 업로드합니다.
 * - 최대 1024px로 리사이즈
 * - JPEG 품질 70%로 압축
 * - 원본 대비 ~80% 용량 감소
 */
export async function uploadFacePhoto(userId: string, uri: string): Promise<UploadResult> {
  // 이미지 리사이즈 + 압축
  const compressed = await ImageManipulator.manipulate(uri)
    .resize({ width: 1024 })
    .renderAsync();
  const savedImage = await compressed.saveAsync({
    compress: 0.7,
    format: SaveFormat.JPEG,
  });

  // 압축된 이미지를 blob으로 변환
  const response = await fetch(savedImage.uri);
  const blob = await response.blob();

  // Firebase Storage 경로: faces/{userId}/{timestamp}.jpg
  const fileName = `${Date.now()}.jpg`;
  const storagePath = `faces/${userId}/${fileName}`;
  const storageRef = ref(storage, storagePath);

  // 업로드
  await uploadBytes(storageRef, blob);

  // 다운로드 URL 반환
  const downloadURL = await getDownloadURL(storageRef);
  return { downloadURL, storagePath };
}
