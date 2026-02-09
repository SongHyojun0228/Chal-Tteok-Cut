import { StyleData } from '../constants/mockStyles';
import { FaceDetails } from './faceAnalysisService';
import { UserProfile } from './userService';
import { FaceShape } from '../types';

interface ScoredStyle extends StyleData {
  matchScore: number;
  matchReasons: string[];
}

/**
 * 사용자 프로필 + 얼굴 분석 데이터 기반으로 스타일 매칭 점수를 계산합니다.
 *
 * 점수 구성 (100점 만점):
 * - 얼굴형 매칭: 30점
 * - 모질 매칭: 20점
 * - 모량 매칭: 15점
 * - 얼굴 세부 특징 매칭: 20점
 * - 관리 시간 선호 매칭: 10점
 * - 스타일 선호 매칭: 5점
 */
export function calculateMatchScore(
  style: StyleData,
  profile: UserProfile,
  faceShape?: FaceShape,
  faceDetails?: FaceDetails,
): ScoredStyle {
  let score = 0;
  const reasons: string[] = [];

  // 1. 얼굴형 매칭 (30점)
  if (faceShape && style.faceShapes.includes(faceShape)) {
    score += 30;
    reasons.push('얼굴형에 잘 어울려요');
  } else if (faceShape) {
    score += 10; // 기본 점수
  } else {
    score += 15; // 얼굴형 데이터 없으면 중간
  }

  // 2. 모질 매칭 (20점)
  if (style.hairTypes && profile.hairType) {
    const hairTypeMap: Record<string, string> = {
      straight: 'straight',
      wavy: 'wavy',
      curly: 'curly',
    };
    const userHairType = hairTypeMap[profile.hairType];
    if (userHairType && style.hairTypes.includes(userHairType as any)) {
      score += 20;
      reasons.push('모질에 적합한 스타일이에요');
    } else if (userHairType) {
      score += 5;
    } else {
      score += 10; // unknown
    }
  } else {
    score += 10;
  }

  // 3. 모량 매칭 (15점)
  if (style.hairAmounts && profile.hairAmount) {
    const amountMap: Record<string, string> = {
      thin: 'thin',
      medium: 'medium',
      thick: 'thick',
    };
    const userAmount = amountMap[profile.hairAmount];
    if (userAmount && style.hairAmounts.includes(userAmount as any)) {
      score += 15;
      reasons.push('모량에 맞는 스타일이에요');
    } else if (userAmount) {
      score += 3;
    } else {
      score += 8; // unknown
    }
  } else {
    score += 8;
  }

  // 4. 얼굴 세부 특징 매칭 (20점)
  if (faceDetails && style.bestFor) {
    let featureMatches = 0;
    let totalFeatures = 0;

    if (style.bestFor.foreheadWidth && faceDetails.foreheadWidth) {
      totalFeatures++;
      if (style.bestFor.foreheadWidth.includes(faceDetails.foreheadWidth)) {
        featureMatches++;
      }
    }
    if (style.bestFor.jawShape && faceDetails.jawShape) {
      totalFeatures++;
      if (style.bestFor.jawShape.includes(faceDetails.jawShape)) {
        featureMatches++;
      }
    }
    if (style.bestFor.lowerFaceLength && faceDetails.lowerFaceLength) {
      totalFeatures++;
      if (style.bestFor.lowerFaceLength.includes(faceDetails.lowerFaceLength)) {
        featureMatches++;
      }
    }
    if (style.bestFor.cheekboneProminence && faceDetails.cheekboneProminence) {
      totalFeatures++;
      if (style.bestFor.cheekboneProminence.includes(faceDetails.cheekboneProminence)) {
        featureMatches++;
      }
    }

    if (totalFeatures > 0) {
      const featureScore = Math.round((featureMatches / totalFeatures) * 20);
      score += featureScore;
      if (featureMatches > 0) {
        reasons.push('얼굴 특징에 맞춤 추천');
      }
    } else {
      score += 10;
    }
  } else {
    score += 10;
  }

  // 5. 관리 시간 매칭 (10점)
  if (profile.stylingTime) {
    const timeMap: Record<string, number> = {
      under_5: 5,
      about_10: 10,
      over_20: 20,
    };
    const userTime = timeMap[profile.stylingTime];
    if (userTime) {
      if (style.maintenanceTime <= userTime) {
        score += 10;
        if (style.maintenanceTime <= 5 && userTime <= 5) {
          reasons.push('빠른 스타일링이 가능해요');
        }
      } else {
        // 관리 시간 초과 시 감점
        const overTime = style.maintenanceTime - userTime;
        score += Math.max(0, 10 - overTime);
      }
    } else {
      score += 5; // unknown
    }
  } else {
    score += 5;
  }

  // 6. 스타일 선호 매칭 (5점)
  if (profile.stylePref) {
    const prefTagMap: Record<string, string[]> = {
      natural: ['자연스러운', '부드러운', '편한'],
      trendy: ['트렌디', '성수감성', 'Y2K', '레트로'],
      unique: ['개성있는', '빈티지', '동양적'],
    };
    const prefTags = prefTagMap[profile.stylePref];
    if (prefTags && style.tags.some((tag) => prefTags.includes(tag))) {
      score += 5;
      reasons.push('선호 스타일과 잘 맞아요');
    }
  }

  // 점수 범위 조정 (60~99)
  const finalScore = Math.min(99, Math.max(60, Math.round(score)));

  // 추천 이유가 없으면 기본 이유
  if (reasons.length === 0) {
    reasons.push('인기 스타일이에요');
  }

  return {
    ...style,
    matchScore: finalScore,
    matchReasons: reasons,
  };
}

/**
 * 스타일 목록을 사용자에게 맞게 필터링하고 점수를 계산해서 정렬합니다.
 */
export function getRecommendedStyles(
  styles: StyleData[],
  profile: UserProfile,
): ScoredStyle[] {
  const faceShape = profile.faceShape as FaceShape | undefined;
  const faceDetails = profile.faceAnalysis?.details;

  // 1. 성별 필터링
  const genderFiltered = styles.filter(
    (s) => s.gender === 'unisex' || s.gender === profile.gender
  );

  // 2. 점수 계산
  const scored = genderFiltered.map((s) =>
    calculateMatchScore(s, profile, faceShape, faceDetails)
  );

  // 3. 점수 순 정렬
  scored.sort((a, b) => b.matchScore - a.matchScore);

  return scored;
}
