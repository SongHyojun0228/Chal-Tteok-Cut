// 네비게이션 타입 정의
export type RootStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  ProfileFlow: { mode?: 'full' | 'photoOnly' } | undefined;
  MainTabs: undefined;
  StyleDetail: { styleId: string };
  Legal: { type: 'privacy' | 'terms' };
  FAQ: undefined;
  AllStyles: undefined;
  CompareStyles: { styleIds: string[] };
};

export type ProfileFlowParamList = {
  Camera: { mode?: 'full' | 'photoOnly' };
  Questions: { storagePath?: string };
  Analyzing: { storagePath?: string; photoOnly?: boolean };
};

export type MainTabParamList = {
  Result: undefined;
  Profile: undefined;
  Settings: undefined;
};

// 얼굴형 타입
export type FaceShape = 'round' | 'oval' | 'square' | 'oblong' | 'heart';

// 모질 타입
export type HairType = 'straight' | 'wavy' | 'curly';

// 모량 타입
export type HairAmount = 'thin' | 'medium' | 'thick';
