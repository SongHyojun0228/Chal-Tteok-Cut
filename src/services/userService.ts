import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaceAnalysisResult } from './faceAnalysisService';

export type UserProfile = {
  gender: string;
  hairType: string;
  hairAmount: string;
  scalpType: string;
  hairLength: string;
  stylingTime: string;
  stylePref: string;
  faceShape?: string;
  faceAnalysis?: FaceAnalysisResult & { analyzedAt?: any };
  savedStyles: string[];
  createdAt?: any;
  updatedAt?: any;
};

// 질문 답변 key → 한글 라벨 매핑
export const answerLabels: Record<string, Record<string, string>> = {
  gender: { male: '남성', female: '여성', unknown: '모르겠어요' },
  hair_type: { straight: '직모', wavy: '약한 웨이브', curly: '강한 곱슬', unknown: '모르겠어요' },
  hair_amount: { thin: '적음', medium: '보통', thick: '많음', unknown: '모르겠어요' },
  scalp_type: { oily: '지성', normal: '중성', dry: '건성', unknown: '모르겠어요' },
  hair_length: {
    buzz: '스포츠컷/크루컷', short: '숏컷', medium: '미디엄', long: '장발',
    very_short: '초단발', unknown: '모르겠어요',
  },
  styling_time: { under_5: '5분 이하', about_10: '10분 정도', over_20: '20분 이상', unknown: '모르겠어요' },
  style_pref: { natural: '자연스러운', trendy: '트렌디한', unique: '개성있는', unknown: '모르겠어요' },
};

// 프로필 저장
export async function saveUserProfile(userId: string, answers: Record<string, string>) {
  const profile: UserProfile = {
    gender: answers.gender || '',
    hairType: answers.hair_type || '',
    hairAmount: answers.hair_amount || '',
    scalpType: answers.scalp_type || '',
    hairLength: answers.hair_length || '',
    stylingTime: answers.styling_time || '',
    stylePref: answers.style_pref || '',
    faceShape: 'unknown', // TODO: AI 분석 후 업데이트
    savedStyles: [],
    updatedAt: serverTimestamp(),
  };

  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    // 기존 유저 → 업데이트 (savedStyles 유지)
    const existing = userDoc.data();
    await updateDoc(userRef, {
      ...profile,
      savedStyles: existing.savedStyles || [],
    });
  } else {
    // 새 유저 → 생성
    await setDoc(userRef, {
      ...profile,
      createdAt: serverTimestamp(),
    });
  }
}

// 프로필 불러오기
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
}

// 스타일 저장/삭제 토글
export async function toggleSavedStyle(userId: string, styleId: string) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const data = userDoc.data();
    const savedStyles: string[] = data.savedStyles || [];

    if (savedStyles.includes(styleId)) {
      // 이미 저장됨 → 삭제
      await updateDoc(userRef, {
        savedStyles: savedStyles.filter((id) => id !== styleId),
      });
      return false; // 삭제됨
    } else {
      // 저장
      await updateDoc(userRef, {
        savedStyles: [...savedStyles, styleId],
      });
      return true; // 저장됨
    }
  }
  return false;
}

// 프로필 존재 여부 확인
export async function hasProfile(userId: string): Promise<boolean> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists();
}
