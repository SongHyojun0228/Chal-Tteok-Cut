# ✂️ 찰떡컷 (Chaltteok-Cut)

> **"찰떡같이 어울리는 헤어컷"** - AI가 얼굴형/모질/두상을 분석해서 나에게 딱 맞는 헤어스타일을 추천해주는 앱

<br>

## 바로 사용하기

**https://chaltteok-cut.web.app**

위 링크에 접속하면 바로 사용할 수 있습니다. 앱 설치 없이 브라우저에서 동작하며, 아래 방법으로 홈 화면에 추가하면 앱처럼 사용할 수 있습니다.

<br>

## 📲 앱으로 설치하는 법 (PWA)

### iPhone (iOS Safari)

1. **Safari**로 https://chaltteok-cut.web.app 접속
2. 하단 **공유 버튼** (네모에서 화살표 나오는 아이콘) 탭
3. 아래로 스크롤해서 **"홈 화면에 추가"** 탭
4. 이름 확인 후 **"추가"** 탭
5. 홈 화면에 찰떡컷 아이콘이 생깁니다!

> ⚠️ **반드시 Safari**에서 해야 합니다. Chrome/카카오톡 인앱 브라우저에서는 "홈 화면에 추가"가 안 보입니다.

### Android (Chrome)

1. **Chrome**으로 https://chaltteok-cut.web.app 접속
2. 우측 상단 **점 세개 메뉴(⋮)** 탭
3. **"홈 화면에 추가"** 또는 **"앱 설치"** 탭
4. 확인 후 **"추가"** 탭
5. 홈 화면에 찰떡컷 아이콘이 생깁니다!

### PC (Chrome / Edge)

1. https://chaltteok-cut.web.app 접속
2. 주소창 오른쪽 **설치 아이콘** (모니터+화살표) 클릭
3. **"설치"** 클릭하면 독립 앱 창으로 실행됩니다

<br>

## 핵심 기능

### 1. AI 얼굴형 분석
- 정면 사진 한 장으로 얼굴형 자동 분류 (둥근형/계란형/각진형/긴형/역삼각형)
- Google Cloud Vision API 기반 32개 랜드마크 분석
- 이마 너비, 광대, 턱선, 얼굴 비율, 3등분 비율까지 상세 분석

### 2. 맞춤 스타일 추천
- 58개 스타일 DB (여성 36 + 남성 22)
- 얼굴형(30점) + 모질/모량(35점) + 얼굴 세부 특징(20점) + 선호도(15점) 종합 점수
- 캐러셀 UI로 스와이프하며 Top 추천 확인

### 3. 스타일 비교
- 전체 스타일에서 2~3개 선택해서 나란히 비교
- 매칭 점수, 난이도, 가격, 모질 적합도 한눈에 확인

### 4. 미용사 공유 (QR 카드)
- 스타일 상세에서 QR 코드 카드 생성
- 이미지로 캡처해서 저장/공유 가능
- 미용실 방문 시 미용사에게 바로 보여주기

### 5. 스타일 제안
- 원하는 스타일이 없으면 설정에서 직접 제안
- 스타일명 + 설명 + 참고 URL 제출 가능

<br>

## 기술 스택

| 영역 | 기술 |
|------|------|
| **Frontend** | React Native (Expo SDK 54), TypeScript |
| **Backend** | Firebase (Auth, Firestore, Storage, Cloud Functions v2) |
| **AI/ML** | Google Cloud Vision API (32 landmarks) |
| **웹 배포** | Firebase Hosting (PWA) |
| **주요 라이브러리** | React Navigation, react-native-qrcode-svg, react-native-view-shot, expo-image-picker |

<br>

## 프로젝트 구조

```
src/
├── components/         # 재사용 컴포넌트 (StyleCard 등)
├── config/             # Firebase 설정
├── constants/          # 스타일 DB, 색상, 이미지 매핑
├── contexts/           # AuthContext
├── navigation/         # AppNavigator (Stack + Tab)
├── screens/            # 13개 화면
│   ├── LoginScreen         # 로그인
│   ├── OnboardingScreen    # 온보딩 (3슬라이드)
│   ├── CameraScreen        # 사진 촬영/선택
│   ├── QuestionsScreen     # 질문 응답 (7개)
│   ├── AnalyzingScreen     # AI 분석 로딩
│   ├── ResultScreen        # 추천 캐러셀
│   ├── StyleDetailScreen   # 스타일 상세 + QR 공유
│   ├── AllStylesScreen     # 전체 스타일 + 비교 모드
│   ├── CompareStylesScreen # 스타일 비교
│   ├── ProfileScreen       # 내 프로필
│   ├── SettingsScreen      # 설정 + 스타일 제안
│   ├── FAQScreen           # 자주 묻는 질문
│   └── LegalScreen         # 이용약관/개인정보처리방침
├── services/           # 비즈니스 로직
│   ├── faceAnalysisService   # 얼굴형 분석 (Cloud Function 호출)
│   ├── recommendationService # 추천 알고리즘
│   ├── userService           # Firestore CRUD
│   └── storageService        # 이미지 업로드
└── types/              # TypeScript 타입 정의

functions/              # Cloud Functions (analyzeFace)
```

<br>

## 로컬 개발

### 사전 준비
- Node.js 20+
- npm
- Expo CLI (`npm install -g expo-cli`)
- Firebase 프로젝트 (`.env` 파일 필요)

### 설치 및 실행

```bash
# 클론
git clone https://github.com/SongHyojun0228/Chal-Tteok-Cut.git
cd Chal-Tteok-Cut

# 의존성 설치
npm install

# 환경변수 설정 (.env 파일 생성)
cp .env.example .env
# Firebase 설정값 입력

# 개발 서버 실행
npx expo start

# 웹 빌드
npx expo export --platform web

# Firebase Hosting 배포
npx firebase deploy --only hosting
```

### 환경변수 (.env)

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

<br>

## 향후 계획

- [ ] AR 가상 시뮬레이션
- [ ] 미용사 매칭 & 예약 시스템
- [ ] 커뮤니티 (스타일 공유, Q&A)
- [ ] App Store / Google Play 정식 출시
- [ ] 딥러닝 모델로 얼굴형 분류 정확도 향상

<br>

## 라이선스

이 프로젝트는 개인 프로젝트입니다. 무단 복제 및 상업적 사용을 금합니다.

<br>

---

**바이브코딩으로 만든 찰떡컷** ✂️ | 개발: [SongHyojun0228](https://github.com/SongHyojun0228) + Claude
