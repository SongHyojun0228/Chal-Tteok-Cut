import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { ImageAnnotatorClient } from "@google-cloud/vision";

admin.initializeApp();

const visionClient = new ImageAnnotatorClient();

type FaceShape = "round" | "oval" | "square" | "oblong" | "heart";

interface FaceDetails {
  // 기본 비율
  widthToHeightRatio: number;
  // 이마
  foreheadWidth: "narrow" | "medium" | "wide";
  foreheadRatio: number;
  // 광대
  cheekboneProminence: "flat" | "moderate" | "prominent";
  cheekboneRatio: number;
  // 턱/하관
  jawWidth: "narrow" | "medium" | "wide";
  jawShape: "round" | "angular" | "pointed";
  jawRatio: number;
  // 얼굴 3등분 (상안부/중안부/하안부)
  faceThirds: {
    upper: number; // 이마~눈썹 비율
    middle: number; // 눈썹~코끝 비율
    lower: number; // 코끝~턱끝 비율
  };
  lowerFaceLength: "short" | "medium" | "long";
  // 전체 인상
  overallImpression: string;
}

interface FaceAnalysisResult {
  faceShape: FaceShape;
  confidence: number;
  details: FaceDetails;
  recommendations: string[]; // 얼굴 특징 기반 스타일 팁
}

function classifyFaceShape(landmarks: Array<{x: number; y: number}>): FaceAnalysisResult {
  const names = [
    "LEFT_EYE", "RIGHT_EYE", "LEFT_OF_LEFT_EYEBROW", "RIGHT_OF_LEFT_EYEBROW",
    "LEFT_OF_RIGHT_EYEBROW", "RIGHT_OF_RIGHT_EYEBROW", "MIDPOINT_BETWEEN_EYES",
    "NOSE_TIP", "UPPER_LIP", "LOWER_LIP", "MOUTH_LEFT", "MOUTH_RIGHT",
    "MOUTH_CENTER", "NOSE_BOTTOM_RIGHT", "NOSE_BOTTOM_LEFT", "NOSE_BOTTOM_CENTER",
    "LEFT_EYE_TOP_BOUNDARY", "LEFT_EYE_RIGHT_CORNER", "LEFT_EYE_BOTTOM_BOUNDARY",
    "LEFT_EYE_LEFT_CORNER", "RIGHT_EYE_TOP_BOUNDARY", "RIGHT_EYE_RIGHT_CORNER",
    "RIGHT_EYE_BOTTOM_BOUNDARY", "RIGHT_EYE_LEFT_CORNER", "LEFT_EYEBROW_UPPER_MIDPOINT",
    "RIGHT_EYEBROW_UPPER_MIDPOINT", "LEFT_EAR_TRAGION", "RIGHT_EAR_TRAGION",
    "FOREHEAD_GLABELLA", "CHIN_GNATHION", "CHIN_LEFT_GONION", "CHIN_RIGHT_GONION",
  ];

  const lm: Record<string, {x: number; y: number}> = {};
  landmarks.forEach((l, i) => {
    if (i < names.length) lm[names[i]] = l;
  });

  const forehead = lm["FOREHEAD_GLABELLA"];
  const chin = lm["CHIN_GNATHION"];
  const leftEar = lm["LEFT_EAR_TRAGION"];
  const rightEar = lm["RIGHT_EAR_TRAGION"];
  const leftJaw = lm["CHIN_LEFT_GONION"];
  const rightJaw = lm["CHIN_RIGHT_GONION"];
  const leftBrow = lm["LEFT_OF_LEFT_EYEBROW"];
  const rightBrow = lm["RIGHT_OF_RIGHT_EYEBROW"];
  const leftBrowMid = lm["LEFT_EYEBROW_UPPER_MIDPOINT"];
  const rightBrowMid = lm["RIGHT_EYEBROW_UPPER_MIDPOINT"];
  const noseBottom = lm["NOSE_BOTTOM_CENTER"];
  const mouthLeft = lm["MOUTH_LEFT"];
  const mouthRight = lm["MOUTH_RIGHT"];

  const dist = (a: {x:number;y:number}, b: {x:number;y:number}) =>
    Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

  if (!forehead || !chin || !leftEar || !rightEar || !leftJaw || !rightJaw) {
    return {
      faceShape: "oval", confidence: 0.5,
      details: {
        widthToHeightRatio: 0,
        foreheadWidth: "medium", foreheadRatio: 0,
        cheekboneProminence: "moderate", cheekboneRatio: 0,
        jawWidth: "medium", jawShape: "round", jawRatio: 0,
        faceThirds: { upper: 33, middle: 33, lower: 33 },
        lowerFaceLength: "medium",
        overallImpression: "분석 데이터 부족",
      },
      recommendations: [],
    };
  }

  // ===== 측정값 계산 =====
  // FOREHEAD_GLABELLA는 미간(눈썹 사이)이므로, 실제 이마 꼭대기를 추정해야 함
  // 중안부(눈썹~코끝)와 비슷한 길이를 상안부로 추정
  const browMidY = (leftBrowMid && rightBrowMid)
    ? (leftBrowMid.y + rightBrowMid.y) / 2
    : forehead.y;
  const middleDist = noseBottom ? Math.abs(noseBottom.y - browMidY) : 0;
  const lowerDist = noseBottom ? Math.abs(chin.y - noseBottom.y) : 0;

  // 상안부 추정: 이마 꼭대기 = 눈썹 위로 중안부의 ~85% 거리
  const estimatedUpperDist = middleDist > 0 ? middleDist * 0.85 : Math.abs(browMidY - forehead.y);
  const estimatedForeheadTop = { x: forehead.x, y: browMidY - estimatedUpperDist };

  // 보정된 얼굴 높이 (추정 이마 꼭대기 ~ 턱끝)
  const faceHeight = Math.abs(chin.y - estimatedForeheadTop.y);
  const faceWidth = dist(leftEar, rightEar);
  const jawWidthVal = dist(leftJaw, rightJaw);
  const foreheadWidthVal = leftBrow && rightBrow ? dist(leftBrow, rightBrow) : faceWidth * 0.8;

  // 광대 너비 (귀 위치 = 광대 근사치)
  const cheekboneWidth = faceWidth;

  // 비율
  const widthToHeightRatio = faceWidth / faceHeight;
  const jawToFaceRatio = jawWidthVal / faceWidth;
  const foreheadToFaceRatio = foreheadWidthVal / faceWidth;
  const foreheadToJawRatio = foreheadWidthVal / jawWidthVal;
  const cheekToJawRatio = cheekboneWidth / jawWidthVal;

  // 입 너비 / 얼굴 너비
  const mouthWidth = (mouthLeft && mouthRight) ? dist(mouthLeft, mouthRight) : 0;
  const mouthToFaceRatio = mouthWidth > 0 ? mouthWidth / faceWidth : 0;

  // 얼굴 3등분 계산 (보정된 상안부 사용)
  let upperThird = 33, middleThird = 33, lowerThird = 33;
  if (middleDist > 0 && lowerDist > 0) {
    const totalDist = estimatedUpperDist + middleDist + lowerDist;
    if (totalDist > 0) {
      upperThird = Math.round((estimatedUpperDist / totalDist) * 100);
      middleThird = Math.round((middleDist / totalDist) * 100);
      lowerThird = Math.round((lowerDist / totalDist) * 100);
    }
  }

  // 턱~턱끝 각도 (턱 형태 판단)
  const jawAngleLeft = chin.x !== leftJaw.x
    ? Math.atan2(Math.abs(chin.y - leftJaw.y), Math.abs(chin.x - leftJaw.x)) * (180 / Math.PI)
    : 90;
  const jawAngleRight = chin.x !== rightJaw.x
    ? Math.atan2(Math.abs(chin.y - rightJaw.y), Math.abs(chin.x - rightJaw.x)) * (180 / Math.PI)
    : 90;
  const avgJawAngle = (jawAngleLeft + jawAngleRight) / 2;

  // ===== 세부 특징 분류 =====

  // 이마 너비
  const foreheadWidth: "narrow" | "medium" | "wide" =
    foreheadToFaceRatio < 0.7 ? "narrow" : foreheadToFaceRatio > 0.85 ? "wide" : "medium";

  // 광대 돌출
  const cheekboneProminence: "flat" | "moderate" | "prominent" =
    cheekToJawRatio < 1.15 ? "flat" : cheekToJawRatio > 1.35 ? "prominent" : "moderate";

  // 턱 너비 (캘리브레이션: 0.72~0.86 분포, 중앙값 ~0.77)
  const jawWidthClass: "narrow" | "medium" | "wide" =
    jawToFaceRatio < 0.74 ? "narrow" : jawToFaceRatio > 0.79 ? "wide" : "medium";

  // 턱 형태 (각도 + 너비 복합 판단, 캘리브레이션: 각도 21~39 분포)
  // 각진: 턱이 넓고 각도가 낮은 경우만 (넓고 평평한 턱)
  // 뾰족: 턱이 좁고 각도가 높은 경우 (좁고 가파른 턱)
  const jawShape: "round" | "angular" | "pointed" =
    (avgJawAngle <= 30 && jawToFaceRatio >= 0.79) ? "angular" :
    (avgJawAngle >= 36 && jawToFaceRatio <= 0.77) ? "pointed" : "round";

  // 하안부 길이
  const lowerFaceLength: "short" | "medium" | "long" =
    lowerThird < 28 ? "short" : lowerThird > 38 ? "long" : "medium";

  // ===== 얼굴형 분류 (Priority Rule v2 - 캘리브레이션 최적화) =====
  let faceShape: FaceShape;
  let confidence: number;

  // Rule 1: 턱이 매우 넓고 각도 큼 → 각진형
  if (jawToFaceRatio >= 0.82 && avgJawAngle >= 30) {
    faceShape = "square";
    confidence = 0.70;
  }
  // Rule 2: 턱이 매우 넓고 각도 작음 → 긴형
  else if (jawToFaceRatio >= 0.82 && avgJawAngle < 30) {
    faceShape = "oblong";
    confidence = 0.70;
  }
  // Rule 3: 턱 넓고 이마/턱 낮고 각도 작음 → 각진형
  else if (jawToFaceRatio >= 0.81 && foreheadToJawRatio < 0.90 && avgJawAngle <= 31) {
    faceShape = "square";
    confidence = 0.65;
  }
  // Rule 4: 턱각도 매우 작고 턱 넓음 → 긴형
  else if (avgJawAngle < 24 && jawToFaceRatio >= 0.77) {
    faceShape = "oblong";
    confidence = 0.65;
  }
  // Rule 5: 턱 꽤 넓고 각도 작고 이마/턱 비율 낮음 → 긴형
  else if (jawToFaceRatio >= 0.79 && avgJawAngle < 30 && foreheadToJawRatio < 0.92) {
    faceShape = "oblong";
    confidence = 0.60;
  }
  // Rule 6: 이마/턱 비율 매우 높음 → 둥근형
  else if (foreheadToJawRatio > 1.05) {
    faceShape = "round";
    confidence = 0.65;
  }
  // Rule 7: 이마/턱 비율 높고 턱 좁고 입 좁음 → 역삼각형
  else if (foreheadToJawRatio > 1.02 && jawToFaceRatio < 0.76 &&
           mouthToFaceRatio > 0 && mouthToFaceRatio < 0.32) {
    faceShape = "heart";
    confidence = 0.65;
  }
  // Rule 8: 이마/턱 낮고 입 좁음 → 역삼각형
  else if (foreheadToJawRatio < 0.93 && mouthToFaceRatio > 0 && mouthToFaceRatio < 0.32) {
    faceShape = "heart";
    confidence = 0.60;
  }
  // Rule 9: 이마/턱 비율 높고 턱 중간 너비이고 각도 중간 → 둥근형
  else if (foreheadToJawRatio >= 0.98 && jawToFaceRatio >= 0.76 &&
           jawToFaceRatio <= 0.78 && avgJawAngle >= 30 && avgJawAngle < 35.5) {
    faceShape = "round";
    confidence = 0.60;
  }
  // Rule 10: 기본값 → 계란형
  else {
    faceShape = "oval";
    confidence = 0.65;
  }
  confidence = Math.min(confidence, 0.95);

  // ===== 전체 인상 =====
  const impressionParts: string[] = [];
  if (foreheadWidth === "narrow") impressionParts.push("이마가 좁은 편");
  if (foreheadWidth === "wide") impressionParts.push("이마가 넓은 편");
  if (lowerFaceLength === "long") impressionParts.push("하관이 긴 편");
  if (lowerFaceLength === "short") impressionParts.push("하관이 짧은 편");
  if (cheekboneProminence === "prominent") impressionParts.push("광대가 도드라진 편");
  if (jawShape === "angular") impressionParts.push("턱선이 각진 편");
  if (jawShape === "pointed") impressionParts.push("턱이 뾰족한 편");
  if (jawWidthClass === "wide") impressionParts.push("턱이 넓은 편");
  const overallImpression = impressionParts.length > 0
    ? impressionParts.join(", ")
    : "균형 잡힌 얼굴형";

  // ===== 맞춤 스타일 팁 =====
  const recommendations: string[] = [];

  if (foreheadWidth === "narrow") {
    recommendations.push("앞머리를 올리거나 볼륨을 주면 이마가 넓어 보여요");
  } else if (foreheadWidth === "wide") {
    recommendations.push("시스루 뱅이나 앞머리로 이마를 자연스럽게 커버해보세요");
  }

  if (lowerFaceLength === "long") {
    recommendations.push("턱선을 감싸는 C컬이나 레이어드가 하관을 커버해줘요");
    recommendations.push("볼 옆에 볼륨을 주면 얼굴이 짧아 보이는 효과가 있어요");
  } else if (lowerFaceLength === "short") {
    recommendations.push("세로 라인을 살려주는 긴 레이어가 잘 어울려요");
  }

  if (cheekboneProminence === "prominent") {
    recommendations.push("광대 옆으로 머리가 내려오는 스타일이 자연스럽게 커버돼요");
  }

  if (jawShape === "angular") {
    recommendations.push("웨이브나 펌으로 부드러운 곡선을 더하면 인상이 부드러워져요");
  } else if (jawShape === "pointed") {
    recommendations.push("턱 라인에 볼륨을 주는 보브컷이 균형을 맞춰줘요");
  }

  if (widthToHeightRatio > 0.9) {
    recommendations.push("세로 길이감을 주는 스타일로 갸름한 느낌을 연출해보세요");
  } else if (widthToHeightRatio < 0.7) {
    recommendations.push("옆으로 볼륨을 주는 스타일이 얼굴 비율을 잡아줘요");
  }

  // ===== 얼굴형별 종합 추천 =====
  const shapeRecommendations: Record<FaceShape, string[]> = {
    round: [
      "[추천] 레이어드컷이나 사이드파트로 세로 길이감을 주면 갸름해 보여요",
      "[추천] 볼륨이 큰 펌보다는 세로로 떨어지는 직모나 C컬이 잘 어울려요",
      "[주의] 볼 옆으로 퍼지는 단발이나 풍성한 보브컷은 얼굴이 더 넓어 보일 수 있어요",
      "[팁] 앞머리를 가르마로 나누면 세로 라인이 강조되어 날씬해 보여요",
    ],
    oval: [
      "[추천] 균형 잡힌 얼굴형이라 대부분의 스타일이 잘 어울려요",
      "[추천] 레이어드, 보브컷, 웨이브 등 다양한 스타일에 도전해보세요",
      "[팁] 현재 얼굴형의 장점을 살려주는 자연스러운 스타일이 가장 예뻐요",
    ],
    square: [
      "[추천] 부드러운 웨이브나 S컬로 각진 인상을 부드럽게 만들어보세요",
      "[추천] 턱선을 감싸는 레이어드나 허쉬컷이 잘 어울려요",
      "[주의] 일자 뱅이나 직선적인 단발은 각진 느낌을 강조할 수 있어요",
      "[팁] 사이드에 볼륨을 주고 턱 주변에 자연스러운 곡선을 만들어보세요",
    ],
    oblong: [
      "[추천] 옆으로 볼륨을 줄 수 있는 웨이브 펌이나 보브컷이 잘 어울려요",
      "[추천] 앞머리를 만들면 얼굴 길이를 줄여주는 효과가 있어요",
      "[주의] 긴 생머리나 볼륨 없이 납작한 스타일은 얼굴이 더 길어 보일 수 있어요",
      "[팁] 귀 옆 높이에서 볼륨감을 주면 얼굴 비율이 안정돼 보여요",
    ],
    heart: [
      "[추천] 턱 라인에 볼륨을 주는 보브컷이나 레이어드가 잘 어울려요",
      "[추천] 사이드뱅이나 커튼뱅으로 넓은 이마를 자연스럽게 커버해보세요",
      "[주의] 정수리에만 볼륨이 큰 스타일은 이마가 더 넓어 보일 수 있어요",
      "[팁] 턱 아래로 볼륨을 더하면 전체적인 균형감이 좋아져요",
    ],
  };

  const shapeTips = shapeRecommendations[faceShape];
  if (shapeTips) {
    recommendations.push(...shapeTips);
  }

  return {
    faceShape,
    confidence,
    details: {
      widthToHeightRatio: Math.round(widthToHeightRatio * 100) / 100,
      foreheadWidth,
      foreheadRatio: Math.round(foreheadToFaceRatio * 100) / 100,
      cheekboneProminence,
      cheekboneRatio: Math.round(cheekToJawRatio * 100) / 100,
      jawWidth: jawWidthClass,
      jawShape,
      jawRatio: Math.round(jawToFaceRatio * 100) / 100,
      faceThirds: { upper: upperThird, middle: middleThird, lower: lowerThird },
      lowerFaceLength,
      overallImpression,
    },
    recommendations,
  };
}

/**
 * Cloud Function v2: 얼굴형 분석
 */
export const analyzeFace = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
  }

  const { storagePath } = request.data;
  if (!storagePath || typeof storagePath !== "string") {
    throw new HttpsError("invalid-argument", "storagePath가 필요합니다.");
  }

  const userId = request.auth.uid;
  if (!storagePath.startsWith(`faces/${userId}/`)) {
    throw new HttpsError("permission-denied", "본인 사진만 분석할 수 있습니다.");
  }

  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath);
    const [exists] = await file.exists();

    if (!exists) {
      throw new HttpsError("not-found", "사진을 찾을 수 없습니다.");
    }

    // Firebase Storage 다운로드 URL 생성 (클라이언트 SDK가 업로드 시 생성한 토큰 사용)
    const [metadata] = await file.getMetadata();
    const token = metadata.metadata?.firebaseStorageDownloadTokens || "";
    const downloadURL = token
      ? `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`
      : "";

    const gcsUri = `gs://${bucket.name}/${storagePath}`;
    const [result] = await visionClient.faceDetection(gcsUri);
    const faces = result.faceAnnotations;

    if (!faces || faces.length === 0) {
      throw new HttpsError("not-found", "얼굴을 감지할 수 없습니다. 정면 사진으로 다시 시도해주세요.");
    }

    const face = faces[0];
    const landmarks = face.landmarks;

    if (!landmarks || landmarks.length === 0) {
      throw new HttpsError("internal", "얼굴 랜드마크를 추출할 수 없습니다.");
    }

    const coords = landmarks.map((l) => ({
      x: l.position?.x || 0,
      y: l.position?.y || 0,
    }));

    const analysis = classifyFaceShape(coords);

    // Firestore에 상세 결과 저장
    await admin.firestore().doc(`users/${userId}`).set(
      {
        faceShape: analysis.faceShape,
        facePhotoURL: downloadURL,
        faceAnalysis: {
          ...analysis,
          analyzedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      },
      { merge: true }
    );

    return analysis;
  } catch (error: any) {
    if (error instanceof HttpsError) throw error;
    console.error("Face analysis error:", error);
    throw new HttpsError("internal", "분석 중 오류가 발생했습니다.");
  }
});
