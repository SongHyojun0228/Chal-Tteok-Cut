import { StyleData } from '../constants/mockStyles';
import { FaceDetails } from './faceAnalysisService';
import { UserProfile } from './userService';
import { FaceShape } from '../types';
import { styleHeadShapeData } from '../constants/headShapeData';
import { styleHairTypeData } from '../constants/hairTypeData';

interface ScoredStyle extends StyleData {
  matchScore: number;
  matchReasons: string[];
}

/**
 * 사용자 프로필 + 얼굴 분석 데이터 기반으로 스타일 매칭 점수를 계산합니다.
 *
 * 점수 구성 (100점 만점):
 * - 얼굴형 매칭: 25점
 * - 모질 매칭: 15점
 * - 모량 매칭: 10점
 * - 얼굴 세부 특징 매칭: 15점
 * - 두상 매칭: 20점 (뒷통수 7 + 정수리 7 + 머리크기 6)
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

  // 1. 얼굴형 매칭 (25점)
  if (faceShape && style.faceShapes.includes(faceShape)) {
    score += 25;
    reasons.push('얼굴형에 잘 어울려요');
  } else if (faceShape) {
    score += 8;
  } else {
    score += 12;
  }

  // 2. 모질 매칭 (15점) - hairTypeData 우선 사용
  const htData = styleHairTypeData[style.id];
  if (profile.hairType && profile.hairType !== 'unknown') {
    const userHT = profile.hairType as 'straight' | 'wavy' | 'curly';
    const suitableTypes = htData?.suitableHairTypes || style.hairTypes || [];
    if (suitableTypes.includes(userHT)) {
      score += htData?.bestHairType === userHT ? 15 : 12;
      if (htData?.bestHairType === userHT) {
        reasons.push('베스트 모질에 딱 맞아요');
      } else {
        reasons.push('모질에 적합한 스타일이에요');
      }
    } else {
      score += 3;
    }
  } else {
    score += 8;
  }

  // 3. 모량 매칭 (10점) - hairTypeData 우선 사용
  if (profile.hairAmount && profile.hairAmount !== 'unknown') {
    const userHA = profile.hairAmount as 'thin' | 'medium' | 'thick';
    const suitableAmounts = htData?.suitableHairAmounts || style.hairAmounts || [];
    if (suitableAmounts.includes(userHA)) {
      score += 10;
      reasons.push('모량에 맞는 스타일이에요');
    } else {
      score += 2;
    }
  } else {
    score += 5;
  }

  // 4. 얼굴 세부 특징 매칭 (15점)
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
      const featureScore = Math.round((featureMatches / totalFeatures) * 15);
      score += featureScore;
      if (featureMatches > 0) {
        reasons.push('얼굴 특징에 맞춤 추천');
      }
    } else {
      score += 8;
    }
  } else {
    score += 8;
  }

  // 5. 두상 매칭 (20점: 뒷통수 7 + 정수리 7 + 머리크기 6)
  const headData = styleHeadShapeData[style.id];
  if (headData) {
    const hs = headData.suitableHeadShapes;
    let headScore = 0;
    let headMatches = 0;

    // 뒷통수 (7점)
    if (profile.backHeadShape && profile.backHeadShape !== 'unknown') {
      if (hs.backHeadShape.includes(profile.backHeadShape as any)) {
        headScore += 7;
        headMatches++;
      }
    } else {
      headScore += 3;
    }

    // 정수리 (7점)
    if (profile.crownHeight && profile.crownHeight !== 'unknown') {
      if (hs.crownHeight.includes(profile.crownHeight as any)) {
        headScore += 7;
        headMatches++;
      }
    } else {
      headScore += 3;
    }

    // 머리 크기 (6점)
    if (profile.headSize && profile.headSize !== 'unknown') {
      if (hs.headSize.includes(profile.headSize as any)) {
        headScore += 6;
        headMatches++;
      }
    } else {
      headScore += 3;
    }

    score += headScore;
    if (headMatches >= 2) {
      reasons.push('두상에 잘 어울려요');
    }
  } else {
    score += 10;
  }

  // 6. 관리 시간 매칭 (10점)
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
        const overTime = style.maintenanceTime - userTime;
        score += Math.max(0, 10 - overTime);
      }
    } else {
      score += 5;
    }
  } else {
    score += 5;
  }

  // 7. 스타일 선호 매칭 (5점)
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
