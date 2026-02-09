const fs = require("fs");
const path = require("path");
const os = require("os");

// Firebase CLI의 refresh token으로 access token 획득
async function getAccessToken() {
  const configPath = path.join(os.homedir(), ".config/configstore/firebase-tools.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const refreshToken = config.tokens?.refresh_token;

  if (!refreshToken) {
    throw new Error("Firebase CLI에 로그인되어 있지 않습니다. 'firebase login'을 실행하세요.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
      client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`토큰 갱신 실패: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

let ACCESS_TOKEN = null;

// 한글 파일명 → 기대 얼굴형 매핑
const LABELS = {
  "고윤정": "oval",
  "김태리": "oval",
  "수지": "oval",
  "아이유": "heart",
  "제니": "oval",
  "장원영": "heart",
  "한소희": "heart",
  "문가영": "oval",
  "신민아": "oval",
  "김유정": "round",
  "박보영": "round",
  "문채원": "round",
  "박신혜": "oval",
  "송혜교": "round",
  "전지현": "oblong",
  "이영애": "oblong",
  "김새론": "oblong",
  "강다니엘": "square",
  "박서준": "square",
  "이민호": "oblong",
  "차은우": "oval",
  "박보검": "oval",
  "송강호": "square",
  "공유": "oblong",
  "현빈": "oval",
  "뷔": "heart",
  "정국": "oval",
  "송중기": "heart",
  "이종석": "oblong",
  "김수현": "round",
};

const FACE_SHAPE_NAMES = {
  round: "둥근형",
  oval: "계란형",
  square: "각진형",
  oblong: "긴형",
  heart: "역삼각형",
};

const LANDMARK_NAMES = [
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

function dist(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

function classifyFaceShape(landmarks) {
  const lm = {};
  landmarks.forEach((l, i) => {
    if (i < LANDMARK_NAMES.length) lm[LANDMARK_NAMES[i]] = l;
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
  const lowerLip = lm["LOWER_LIP"];
  const leftEye = lm["LEFT_EYE"];
  const rightEye = lm["RIGHT_EYE"];

  if (!forehead || !chin || !leftEar || !rightEar || !leftJaw || !rightJaw) {
    return { faceShape: "unknown", ratios: {}, error: "랜드마크 부족" };
  }

  // 보정된 측정 (현재 Cloud Function과 동일)
  const browMidY = (leftBrowMid && rightBrowMid)
    ? (leftBrowMid.y + rightBrowMid.y) / 2
    : forehead.y;
  const middleDist = noseBottom ? Math.abs(noseBottom.y - browMidY) : 0;
  const lowerDist = noseBottom ? Math.abs(chin.y - noseBottom.y) : 0;
  const estimatedUpperDist = middleDist > 0 ? middleDist * 0.85 : Math.abs(browMidY - forehead.y);

  const faceHeight = Math.abs(chin.y - (browMidY - estimatedUpperDist));
  const faceWidth = dist(leftEar, rightEar);
  const jawWidthVal = dist(leftJaw, rightJaw);
  const foreheadWidthVal = leftBrow && rightBrow ? dist(leftBrow, rightBrow) : faceWidth * 0.8;
  const cheekboneWidth = faceWidth;

  const widthToHeightRatio = faceWidth / faceHeight;
  const jawToFaceRatio = jawWidthVal / faceWidth;
  const foreheadToFaceRatio = foreheadWidthVal / faceWidth;
  const foreheadToJawRatio = foreheadWidthVal / jawWidthVal;
  const cheekToJawRatio = cheekboneWidth / jawWidthVal;

  // 추가 feature: 입 너비 / 얼굴 너비
  const mouthWidth = (mouthLeft && mouthRight) ? dist(mouthLeft, mouthRight) : 0;
  const mouthToFaceRatio = mouthWidth > 0 ? mouthWidth / faceWidth : 0;

  // 추가 feature: 턱 길이 (입아래~턱끝) / 얼굴 높이
  const chinLength = (lowerLip && chin) ? Math.abs(chin.y - lowerLip.y) : 0;
  const chinToFaceRatio = chinLength > 0 ? chinLength / faceHeight : 0;

  // 추가 feature: 눈 간격 / 얼굴 너비
  const eyeDistance = (leftEye && rightEye) ? dist(leftEye, rightEye) : 0;
  const eyeToFaceRatio = eyeDistance > 0 ? eyeDistance / faceWidth : 0;

  // 추가 feature: 얼굴 테이퍼링 (광대-턱 차이 / 얼굴 높이)
  const faceTaper = (cheekboneWidth - jawWidthVal) / faceHeight;

  // 3등분
  const totalDist = estimatedUpperDist + middleDist + lowerDist;
  const upperThird = totalDist > 0 ? Math.round((estimatedUpperDist / totalDist) * 100) : 33;
  const middleThird = totalDist > 0 ? Math.round((middleDist / totalDist) * 100) : 33;
  const lowerThird = totalDist > 0 ? Math.round((lowerDist / totalDist) * 100) : 33;

  // 턱 각도
  const jawAngleLeft = chin.x !== leftJaw.x
    ? Math.atan2(Math.abs(chin.y - leftJaw.y), Math.abs(chin.x - leftJaw.x)) * (180 / Math.PI) : 90;
  const jawAngleRight = chin.x !== rightJaw.x
    ? Math.atan2(Math.abs(chin.y - rightJaw.y), Math.abs(chin.x - rightJaw.x)) * (180 / Math.PI) : 90;
  const avgJawAngle = (jawAngleLeft + jawAngleRight) / 2;

  // 최종 분류 로직: Priority Rule 기반 (v2, 캘리브레이션 최적화)
  // 30명 데이터 분석으로 도출한 우선순위 규칙 (기본값: oval)
  let faceShape = "oval";
  let confidence = 0.65;
  let matchedRule = 0;
  const scores = { round: 0, oval: 0, square: 0, oblong: 0, heart: 0 };

  // Rule 1: 턱이 매우 넓고 각도 큼 → 각진형
  if (jawToFaceRatio >= 0.82 && avgJawAngle >= 30) {
    faceShape = "square";
    matchedRule = 1;
    confidence = 0.70;
  }
  // Rule 2: 턱이 매우 넓고 각도 작음 → 긴형
  else if (jawToFaceRatio >= 0.82 && avgJawAngle < 30) {
    faceShape = "oblong";
    matchedRule = 2;
    confidence = 0.70;
  }
  // Rule 3: 턱 넓고 이마/턱 낮고 각도 작음 → 각진형 (넓은 턱 + 좁은 이마)
  else if (jawToFaceRatio >= 0.81 && foreheadToJawRatio < 0.90 && avgJawAngle <= 31) {
    faceShape = "square";
    matchedRule = 3;
    confidence = 0.65;
  }
  // Rule 4: 턱각도 매우 작고 턱 넓음 → 긴형
  else if (avgJawAngle < 24 && jawToFaceRatio >= 0.77) {
    faceShape = "oblong";
    matchedRule = 4;
    confidence = 0.65;
  }
  // Rule 5: 턱 꽤 넓고 각도 작고 이마/턱 비율 낮음 → 긴형
  else if (jawToFaceRatio >= 0.79 && avgJawAngle < 30 && foreheadToJawRatio < 0.92) {
    faceShape = "oblong";
    matchedRule = 5;
    confidence = 0.60;
  }
  // Rule 6: 이마/턱 비율 매우 높음 → 둥근형 (극단적 이마>턱)
  else if (foreheadToJawRatio > 1.05) {
    faceShape = "round";
    matchedRule = 6;
    confidence = 0.65;
  }
  // Rule 7: 이마/턱 비율 높고 턱 좁고 입 좁음 → 역삼각형
  else if (foreheadToJawRatio > 1.02 && jawToFaceRatio < 0.76 && mouthToFaceRatio > 0 && mouthToFaceRatio < 0.32) {
    faceShape = "heart";
    matchedRule = 7;
    confidence = 0.65;
  }
  // Rule 8: 이마/턱 낮고 입 좁음 → 역삼각형 (좁은 하관)
  else if (foreheadToJawRatio < 0.93 && mouthToFaceRatio > 0 && mouthToFaceRatio < 0.32) {
    faceShape = "heart";
    matchedRule = 8;
    confidence = 0.60;
  }
  // Rule 9: 이마/턱 비율 높고 턱 중간 너비이고 각도 중간 → 둥근형
  else if (foreheadToJawRatio >= 0.98 && jawToFaceRatio >= 0.76 && jawToFaceRatio <= 0.78 && avgJawAngle >= 30 && avgJawAngle < 35.5) {
    faceShape = "round";
    matchedRule = 9;
    confidence = 0.60;
  }
  // Rule 10: 기본값 → 계란형
  else {
    faceShape = "oval";
    matchedRule = 10;
    confidence = 0.65;
  }

  // 디버깅용 점수 (매칭된 규칙 표시)
  scores[faceShape] = matchedRule;
  scores.oval = faceShape === "oval" ? matchedRule : 0;

  return {
    faceShape,
    confidence: Math.round(confidence * 100) / 100,
    scores,
    ratios: {
      widthToHeightRatio: Math.round(widthToHeightRatio * 100) / 100,
      jawToFaceRatio: Math.round(jawToFaceRatio * 100) / 100,
      foreheadToFaceRatio: Math.round(foreheadToFaceRatio * 100) / 100,
      foreheadToJawRatio: Math.round(foreheadToJawRatio * 100) / 100,
      cheekToJawRatio: Math.round(cheekToJawRatio * 100) / 100,
      avgJawAngle: Math.round(avgJawAngle),
      mouthToFaceRatio: Math.round(mouthToFaceRatio * 100) / 100,
      chinToFaceRatio: Math.round(chinToFaceRatio * 100) / 100,
      faceTaper: Math.round(faceTaper * 100) / 100,
      faceThirds: `${upperThird}:${middleThird}:${lowerThird}`,
    },
  };
}

// Vision API REST endpoint 사용 (OAuth Bearer 인증)
async function analyzePhoto(filePath) {
  if (!ACCESS_TOKEN) {
    ACCESS_TOKEN = await getAccessToken();
  }

  const imageBuffer = fs.readFileSync(filePath);
  const base64Image = imageBuffer.toString("base64");

  const url = "https://vision.googleapis.com/v1/images:annotate";
  const body = {
    requests: [{
      image: { content: base64Image },
      features: [{ type: "FACE_DETECTION", maxResults: 1 }],
    }],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "x-goog-user-project": "chaltteok-cut",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Vision API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const faces = data.responses?.[0]?.faceAnnotations;
  if (!faces || faces.length === 0) return null;

  const landmarks = faces[0].landmarks.map((l) => ({
    x: l.position?.x || 0,
    y: l.position?.y || 0,
  }));

  return classifyFaceShape(landmarks);
}

async function main() {
  const photosDir = path.join(__dirname, "../../assets/photos");
  const files = fs.readdirSync(photosDir);

  console.log("=".repeat(80));
  console.log("  찰떡컷 얼굴형 분류 캘리브레이션 테스트");
  console.log("=".repeat(80));
  console.log("");

  const results = [];
  let correct = 0;
  let total = 0;
  const shapeStats = { round: { correct: 0, total: 0 }, oval: { correct: 0, total: 0 }, square: { correct: 0, total: 0 }, oblong: { correct: 0, total: 0 }, heart: { correct: 0, total: 0 } };

  for (const file of files) {
    // macOS NFD → NFC 정규화 (한글 파일명 호환)
    const rawName = path.parse(file).name;
    const name = rawName.normalize("NFC");
    const expected = LABELS[name];
    if (!expected) {
      console.log(`⚠️  ${name}: 라벨 없음, 건너뜀`);
      continue;
    }

    const filePath = path.join(photosDir, file);
    try {
      const result = await analyzePhoto(filePath);
      if (!result || result.faceShape === "unknown") {
        console.log(`❌ ${name}: 얼굴 감지 실패`);
        continue;
      }

      total++;
      shapeStats[expected].total++;
      const isCorrect = result.faceShape === expected;
      if (isCorrect) {
        correct++;
        shapeStats[expected].correct++;
      }

      const mark = isCorrect ? "✅" : "❌";
      const scoreStr = Object.entries(result.scores)
        .map(([k, v]) => `${k[0].toUpperCase()}${v}`)
        .join(" ");
      console.log(`${mark} ${name.padEnd(4)} | 기대: ${FACE_SHAPE_NAMES[expected]}(${expected.padEnd(6)}) → 결과: ${FACE_SHAPE_NAMES[result.faceShape]}(${result.faceShape.padEnd(6)}) | W/H:${result.ratios.widthToHeightRatio} 턱:${result.ratios.jawToFaceRatio} FJ:${result.ratios.foreheadToJawRatio} 각:${result.ratios.avgJawAngle}° | [${scoreStr}]`);

      results.push({ name, expected, predicted: result.faceShape, isCorrect, ...result.ratios });
    } catch (err) {
      console.log(`❌ ${name}: 에러 - ${err.message}`);
    }
  }

  console.log("");
  console.log("=".repeat(80));
  console.log(`  전체 정확도: ${correct}/${total} (${total > 0 ? Math.round(correct / total * 100) : 0}%)`);
  console.log("=".repeat(80));
  console.log("");

  console.log("얼굴형별 정확도:");
  for (const [shape, stats] of Object.entries(shapeStats)) {
    if (stats.total > 0) {
      console.log(`  ${FACE_SHAPE_NAMES[shape]}(${shape}): ${stats.correct}/${stats.total} (${Math.round(stats.correct / stats.total * 100)}%)`);
    }
  }

  // 오분류 패턴 분석
  console.log("");
  console.log("오분류 패턴:");
  const wrong = results.filter(r => !r.isCorrect);
  for (const r of wrong) {
    console.log(`  ${r.name}: ${r.expected} → ${r.predicted} (W/H: ${r.widthToHeightRatio}, 턱비: ${r.jawToFaceRatio}, 이마/턱: ${r.foreheadToJawRatio})`);
  }

  // 비율 통계 (얼굴형별 평균)
  console.log("");
  console.log("얼굴형별 비율 평균 (기대 기준):");
  for (const shape of ["round", "oval", "square", "oblong", "heart"]) {
    const group = results.filter(r => r.expected === shape);
    if (group.length === 0) continue;
    const avgWH = (group.reduce((s, r) => s + r.widthToHeightRatio, 0) / group.length).toFixed(2);
    const avgJaw = (group.reduce((s, r) => s + r.jawToFaceRatio, 0) / group.length).toFixed(2);
    const avgFJ = (group.reduce((s, r) => s + r.foreheadToJawRatio, 0) / group.length).toFixed(2);
    const avgAngle = Math.round(group.reduce((s, r) => s + r.avgJawAngle, 0) / group.length);
    console.log(`  ${FACE_SHAPE_NAMES[shape].padEnd(4)}(${shape.padEnd(6)}): W/H=${avgWH} | 턱비=${avgJaw} | 이마/턱=${avgFJ} | 턱각=${avgAngle}°  [n=${group.length}]`);
  }

  // JSON으로 저장
  fs.writeFileSync(
    path.join(__dirname, "results.json"),
    JSON.stringify(results, null, 2)
  );
  console.log("");
  console.log("📄 상세 결과 저장: functions/calibration/results.json");
}

main().catch(console.error);
