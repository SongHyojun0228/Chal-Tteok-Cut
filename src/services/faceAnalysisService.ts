import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, auth } from '../config/firebase';
import { FaceShape } from '../types';

const functions = getFunctions(app);

export interface FaceDetails {
  widthToHeightRatio: number;
  foreheadWidth: 'narrow' | 'medium' | 'wide';
  foreheadRatio: number;
  cheekboneProminence: 'flat' | 'moderate' | 'prominent';
  cheekboneRatio: number;
  jawWidth: 'narrow' | 'medium' | 'wide';
  jawShape: 'round' | 'angular' | 'pointed';
  jawRatio: number;
  faceThirds: { upper: number; middle: number; lower: number };
  lowerFaceLength: 'short' | 'medium' | 'long';
  overallImpression: string;
}

export interface FaceAnalysisResult {
  faceShape: FaceShape;
  confidence: number;
  details: FaceDetails;
  recommendations: string[];
}

/**
 * Cloud Function을 호출해서 얼굴형 분석
 * @param storagePath - Firebase Storage 경로 (예: "faces/uid/1234.jpg")
 */
export async function analyzeFaceShape(storagePath: string): Promise<FaceAnalysisResult> {
  // auth 토큰이 준비될 때까지 대기
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('로그인이 필요합니다.');
  }

  // 토큰 강제 갱신으로 유효한 토큰 확보
  await currentUser.getIdToken(true);

  const analyzeFace = httpsCallable<{ storagePath: string }, FaceAnalysisResult>(
    functions,
    'analyzeFace'
  );

  const result = await analyzeFace({ storagePath });
  return result.data;
}

/**
 * 얼굴형 한글 이름
 */
export const faceShapeNames: Record<FaceShape, string> = {
  round: '둥근형',
  oval: '계란형',
  square: '각진형',
  oblong: '긴형',
  heart: '역삼각형',
};

/**
 * 얼굴형별 특징 설명
 */
export const faceShapeDescriptions: Record<FaceShape, string> = {
  round: '얼굴 길이와 너비가 비슷하고, 턱선이 둥글고 부드러운 편이에요.',
  oval: '이마와 턱이 균형 잡혀있고, 얼굴이 살짝 길쭉한 이상적인 형태예요.',
  square: '이마, 광대, 턱의 너비가 비슷하고 턱선이 각져있어요.',
  oblong: '얼굴이 세로로 길고, 이마·광대·턱 너비가 비슷한 편이에요.',
  heart: '이마가 넓고 턱이 좁아지는 하트 모양이에요.',
};
