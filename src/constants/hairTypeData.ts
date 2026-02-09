export type StyleHairTypeInfo = {
  suitableHairTypes: ('straight' | 'wavy' | 'curly')[];
  suitableHairAmounts: ('thin' | 'medium' | 'thick')[];
  bestHairType: 'straight' | 'wavy' | 'curly';
  hairTypeNote: string;
  notRecommendedFor?: {
    hairType?: ('straight' | 'wavy' | 'curly')[];
    hairAmount?: ('thin' | 'medium' | 'thick')[];
    reason: string;
  };
};

export const styleHairTypeData: Record<string, StyleHairTypeInfo> = {
  // ====== 여성 스타일 ======
  f_001: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '레이어가 자연스럽게 살아나려면 약간의 웨이브가 있으면 좋아요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '너무 곱슬거나 모량이 적으면 레이어가 뜨거나 볼륨이 없어요' },
  },
  f_002: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 가장 깔끔하고 예쁜 라인이 나와요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thick'], reason: '곱슬이거나 모량이 많으면 보브라인이 뭉개져요' },
  },
  f_003: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 펌하면 웨이브가 선명하게 나와요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '이미 곱슬이거나 모량이 적으면 펌이 과할 수 있어요' },
  },
  f_004: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '모든 모질에 잘 어울리지만 웨이브가 있으면 더 풍성해요',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량이 적으면 상단 볼륨이 부족할 수 있어요' },
  },
  f_005: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 깔끔한 일자 라인이 살아나요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thin'], reason: '웨이브나 곱슬은 라인이 흐트러지고, 모량 적으면 볼륨 부족' },
  },
  f_006: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모에 C컬 펌하면 자연스럽고 예뻐요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thick'], reason: '곱슬이거나 모량 많으면 C컬이 과해 보여요' },
  },
  f_007: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 사이드 라인이 또렷하게 살아나요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thin'], reason: '웨이브나 곱슬은 라인이 흐려지고, 모량 적으면 밋밋해요' },
  },
  f_008: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 가벼운 끝처리가 자연스러워요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thick'], reason: '곱슬이거나 모량 많으면 끝이 뭉쳐 보여요' },
  },
  f_009: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '모든 모질에 잘 어울리지만 웨이브가 있으면 더 자연스러워요',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량이 적으면 볼륨감이 부족해요' },
  },
  f_010: {
    suitableHairTypes: ['wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '웨이브나 곱슬에 레이어드 펌하면 시너지 효과',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량이 적으면 펌이 약해 보여요' },
  },
  f_011: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 히피펌하면 큰 웨이브가 선명하게 나와요',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량이 적으면 웨이브가 빈약해 보여요' },
  },
  f_012: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '웨이브가 있으면 90년대 감성이 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '너무 곱슬거나 모량 적으면 텍스처가 안 살아요' },
  },
  f_013: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 빈티지 펌하면 레트로 무드가 완성돼요',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량 적으면 빈티지 볼륨이 부족해요' },
  },
  f_014: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 리프펌하면 자연스러운 웨이브가 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '이미 곱슬이거나 모량 적으면 펌이 과할 수 있어요' },
  },
  f_015: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 매끈한 슬릭 라인이 완성돼요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thin'], reason: '웨이브나 곱슬은 슬릭 효과가 안 나고, 모량 적으면 밋밋해요' },
  },
  f_016: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모에 허쉬펌하면 볼륨감이 극대화돼요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thick'], reason: '이미 곱슬이거나 모량 많으면 너무 풍성해져요' },
  },
  f_017: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '웨이브가 있으면 레이어가 역동적으로 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '곱슬이거나 모량 적으면 레이어가 과해 보여요' },
  },
  f_018: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모에 태슬 끝처리하면 가벼운 느낌이 살아나요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thick'], reason: '웨이브나 곱슬, 모량 많으면 태슬 효과가 안 나요' },
  },
  f_019: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 S컬 펌하면 빈티지 웨이브가 선명해요',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량 적으면 S컬이 빈약해 보여요' },
  },
  f_020: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 샌드펌하면 자연스러운 웨이브가 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '이미 곱슬이거나 모량 적으면 펌이 과할 수 있어요' },
  },
  f_021: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 C컬 허그펌하면 부드러운 웨이브가 예뻐요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '이미 곱슬이거나 모량 적으면 펌이 약해요' },
  },
  f_022: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 레인펌하면 젖은 듯한 웨이브가 살아나요',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량 적으면 웨이브가 빈약해 보여요' },
  },
  f_023: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 빈티지 펌하면 레트로 웨이브가 선명해요',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량 적으면 빈티지 볼륨이 부족해요' },
  },
  f_024: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 레이어드 라인이 깔끔해요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thick'], reason: '곱슬이거나 모량 많으면 레이어가 뭉개져요' },
  },
  f_025: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 허쉬컷하면 볼륨감이 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '곱슬이거나 모량 적으면 스타일 유지가 어려워요' },
  },
  f_026: {
    suitableHairTypes: ['wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '웨이브나 곱슬에 빈티지 펌하면 자연스러워요',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량 적으면 웨이브가 빈약해요' },
  },
  f_027: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 매끈한 슬릭 효과가 최고예요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thin'], reason: '웨이브나 곱슬은 슬릭이 안 되고, 모량 적으면 볼륨 부족' },
  },
  f_028: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 S컬 펌하면 웨이브가 선명해요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '이미 곱슬이거나 모량 적으면 과할 수 있어요' },
  },
  f_029: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['thin', 'medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 허쉬 볼륨과 슬릭 효과 둘 다 살려요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], reason: '웨이브나 곱슬은 슬릭 효과가 안 나요' },
  },
  f_030: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 C컬 펌하면 자연스러운 웨이브가 예뻐요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '이미 곱슬이거나 모량 적으면 C컬이 과해요' },
  },
  f_031: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 깔끔한 일자 라인이 살아나요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thick'], reason: '웨이브나 곱슬은 라인이 흐트러지고, 모량 많으면 뭉쳐요' },
  },
  f_032: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '웨이브가 있으면 레이어가 자연스럽게 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '곱슬이거나 모량 적으면 레이어가 과해요' },
  },
  f_033: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 컬러가 깔끔하게 발색돼요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thin'], reason: '웨이브나 곱슬은 컬러가 고르지 않고, 모량 적으면 손상 우려' },
  },
  f_034: {
    suitableHairTypes: ['wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '웨이브나 곱슬에 물결펌하면 시너지 효과',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량 적으면 물결이 빈약해요' },
  },
  f_035: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 C컬 펌하면 얼굴을 감싸는 라인이 예뻐요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '이미 곱슬이거나 모량 적으면 펌이 약해요' },
  },
  f_036: {
    suitableHairTypes: ['wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '웨이브나 곱슬에 히피펌하면 자연스러워요',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량 적으면 히피 웨이브가 빈약해요' },
  },
  f_037: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모에 빌리펌하면 자연스러운 웨이브가 살아나요',
    notRecommendedFor: { hairAmount: ['thick'], reason: '모량 많으면 웨이브가 너무 풍성해져요' },
  },

  // ====== 남성 스타일 ======
  m_001: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 깔끔한 라인이 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '곱슬이면 사이드가 뜨고, 모량 적으면 볼륨 부족' },
  },
  m_002: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['thin', 'medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 텍스처 펌하면 자연스러운 볼륨이 생겨요',
    notRecommendedFor: { hairType: ['curly'], reason: '이미 곱슬이면 펌이 과할 수 있어요' },
  },
  m_003: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 앞머리가 자연스럽게 떨어져요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '곱슬이거나 모량 적으면 앞머리가 뜨거나 빈약해요' },
  },
  m_004: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모에 은은한 펌하면 자연스러운 볼륨이 생겨요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thick'], reason: '이미 곱슬이거나 모량 많으면 펌이 과해요' },
  },
  m_005: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 슬릭백 스타일이 완성돼요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thin'], reason: '웨이브나 곱슬은 넘기기 어렵고, 모량 적으면 밋밋해요' },
  },
  m_006: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 깔끔한 가일 라인이 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '곱슬이거나 모량 적으면 라인이 흐트러져요' },
  },
  m_007: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['thin', 'medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 애즈펌하면 웨이브가 선명하게 나와요',
  },
  m_008: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 가르마 라인이 깔끔해요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thin'], reason: '웨이브나 곱슬은 가르마가 흐트러지고, 모량 적으면 볼륨 부족' },
  },
  m_009: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 자연스러운 리프 라인이 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '곱슬이거나 모량 적으면 스타일 유지가 어려워요' },
  },
  m_010: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모에 다운펌하면 자연스러운 볼륨이 생겨요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thick'], reason: '이미 곱슬이거나 모량 많으면 펌이 과해요' },
  },
  m_011: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '웨이브가 있으면 레이어가 자연스럽게 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '곱슬이거나 모량 적으면 레이어가 과해요' },
  },
  m_012: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 텍스처가 깔끔하게 살아나요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '곱슬이거나 모량 적으면 텍스처가 과하거나 부족해요' },
  },
  m_013: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['thin', 'medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 시스루 앞머리가 자연스러워요',
    notRecommendedFor: { hairType: ['curly'], reason: '곱슬이면 시스루 효과가 안 나요' },
  },
  m_014: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 가일 라인과 텍스처가 살아나요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thin'], reason: '웨이브나 곱슬은 라인이 흐트러지고, 모량 적으면 밋밋해요' },
  },
  m_015: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 사이드 짧은 라인이 깔끔해요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thin'], reason: '곱슬이면 사이드가 뜨고, 모량 적으면 볼륨 부족' },
  },
  m_016: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 짧은 컷에 텍스처가 살아나요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thin'], reason: '웨이브나 곱슬은 스타일 유지가 어렵고, 모량 적으면 밋밋해요' },
  },
  m_017: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 빈티지 펌하면 레트로 웨이브가 선명해요',
    notRecommendedFor: { hairAmount: ['thin'], reason: '모량 적으면 빈티지 볼륨이 부족해요' },
  },
  m_018: {
    suitableHairTypes: ['wavy', 'curly'], suitableHairAmounts: ['thin', 'medium', 'thick'], bestHairType: 'wavy',
    hairTypeNote: '웨이브나 곱슬에 히피펌하면 자연스러워요',
  },
  m_019: {
    suitableHairTypes: ['straight', 'wavy'], suitableHairAmounts: ['thin', 'medium'], bestHairType: 'straight',
    hairTypeNote: '직모에 은은한 펌하면 자연스러운 볼륨이 생겨요',
    notRecommendedFor: { hairType: ['curly'], hairAmount: ['thick'], reason: '이미 곱슬이거나 모량 많으면 펌이 과해요' },
  },
  m_020: {
    suitableHairTypes: ['straight', 'wavy', 'curly'], suitableHairAmounts: ['thin', 'medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모에 빌리펌하면 자연스러운 웨이브가 살아나요',
  },
  m_021: {
    suitableHairTypes: ['straight'], suitableHairAmounts: ['medium', 'thick'], bestHairType: 'straight',
    hairTypeNote: '직모일 때 슬릭과 텍스처 효과가 완성돼요',
    notRecommendedFor: { hairType: ['wavy', 'curly'], hairAmount: ['thin'], reason: '웨이브나 곱슬은 슬릭이 안 되고, 모량 적으면 밋밋해요' },
  },
};

// 모질 한글 라벨
export const hairTypeLabels: Record<string, string> = {
  straight: '직모',
  wavy: '웨이브',
  curly: '곱슬',
};

export const hairAmountLabels: Record<string, string> = {
  thin: '적음',
  medium: '보통',
  thick: '많음',
};
