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
  const faceHeight = dist(forehead, chin);
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

  // 얼굴 3등분 계산
  let upperThird = 33, middleThird = 33, lowerThird = 33;
  if (leftBrowMid && rightBrowMid && noseBottom) {
    const browMidY = (leftBrowMid.y + rightBrowMid.y) / 2;
    const upperDist = Math.abs(browMidY - forehead.y);
    const middleDist = Math.abs(noseBottom.y - browMidY);
    const lowerDist = Math.abs(chin.y - noseBottom.y);
    const totalDist = upperDist + middleDist + lowerDist;
    if (totalDist > 0) {
      upperThird = Math.round((upperDist / totalDist) * 100);
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

  // 턱 너비
  const jawWidthClass: "narrow" | "medium" | "wide" =
    jawToFaceRatio < 0.6 ? "narrow" : jawToFaceRatio > 0.75 ? "wide" : "medium";

  // 턱 형태 (각도 기반)
  const jawShape: "round" | "angular" | "pointed" =
    avgJawAngle > 60 ? "pointed" : avgJawAngle > 40 ? "round" : "angular";

  // 하안부 길이
  const lowerFaceLength: "short" | "medium" | "long" =
    lowerThird < 28 ? "short" : lowerThird > 38 ? "long" : "medium";

  // ===== 얼굴형 분류 =====
  let faceShape: FaceShape;
  let confidence: number;

  if (widthToHeightRatio > 0.85) {
    if (jawToFaceRatio > 0.75) {
      faceShape = "square";
      confidence = 0.7 + (jawToFaceRatio - 0.75) * 2;
    } else {
      faceShape = "round";
      confidence = 0.7 + (widthToHeightRatio - 0.85) * 2;
    }
  } else if (widthToHeightRatio < 0.7) {
    faceShape = "oblong";
    confidence = 0.7 + (0.7 - widthToHeightRatio) * 2;
  } else {
    if (foreheadToJawRatio > 1.2) {
      faceShape = "heart";
      confidence = 0.7 + (foreheadToJawRatio - 1.2) * 1.5;
    } else {
      faceShape = "oval";
      confidence = 0.75;
    }
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
