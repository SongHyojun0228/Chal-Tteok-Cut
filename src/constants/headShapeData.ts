export type HeadShapeSuitability = {
  headShape: ('round' | 'oval' | 'flat')[];
  crownHeight: ('high' | 'medium' | 'low')[];
  backHeadShape: ('round' | 'flat')[];
  headSize: ('small' | 'medium' | 'large')[];
};

export type StyleHeadShapeInfo = {
  suitableHeadShapes: HeadShapeSuitability;
  recommendation: string;
};

export const styleHeadShapeData: Record<string, StyleHeadShapeInfo> = {
  // ====== 여성 스타일 ======
  f_001: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['medium', 'low'], backHeadShape: ['round', 'flat'], headSize: ['small', 'medium', 'large'] },
    recommendation: '레이어로 볼륨 조절 가능해 모든 두상에 무난함',
  },
  f_002: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '뒷통수가 둥근 분들에게 특히 예쁨',
  },
  f_003: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['round', 'flat'], headSize: ['small', 'medium'] },
    recommendation: '웨이브로 볼륨을 만들어 정수리 낮은 분들에게 좋음',
  },
  f_004: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '상단 볼륨으로 절벽 커버에 최고',
  },
  f_005: {
    suitableHeadShapes: { headShape: ['oval'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '균형잡힌 두상에 가장 잘 어울림',
  },
  f_006: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['medium', 'low'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: 'C컬로 뒷통수 볼륨 보완 가능',
  },
  f_007: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small'] },
    recommendation: '작은 머리와 둥근 뒷통수에 잘 어울림',
  },
  f_008: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '가벼운 느낌으로 작은 머리에 적합',
  },
  f_009: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '절벽 커버에 효과적',
  },
  f_010: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['medium', 'large'] },
    recommendation: '레이어 + 펌으로 볼륨 극대화',
  },
  f_011: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: '큰 웨이브로 정수리 낮은 분들에게 좋음',
  },
  f_012: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '레트로 스타일로 균형잡힌 두상에 잘 어울림',
  },
  f_013: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: '빈티지 웨이브로 볼륨감 상승',
  },
  f_014: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'low'], backHeadShape: ['round', 'flat'], headSize: ['medium', 'large'] },
    recommendation: '긴 머리 웨이브로 절벽 커버',
  },
  f_015: {
    suitableHeadShapes: { headShape: ['oval'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '매끈한 스타일은 이상적인 두상에 적합',
  },
  f_016: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '상단 볼륨으로 절벽 완벽 커버',
  },
  f_017: {
    suitableHeadShapes: { headShape: ['round', 'oval'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '높은 레이어로 정수리 높은 분들에게 적합',
  },
  f_018: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '가벼운 단발로 작은 머리에 잘 어울림',
  },
  f_019: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['medium', 'large'] },
    recommendation: 'S컬로 볼륨 극대화',
  },
  f_020: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: '자연스러운 웨이브로 절벽 커버',
  },
  f_021: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['medium', 'low'], backHeadShape: ['flat', 'round'], headSize: ['medium', 'large'] },
    recommendation: 'C컬로 뒷통수 보완',
  },
  f_022: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: '자연스러운 웨이브로 볼륨감',
  },
  f_023: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['medium', 'large'] },
    recommendation: '풍성한 볼륨으로 절벽 커버',
  },
  f_024: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '깔끔한 단발은 둥근 뒷통수에 적합',
  },
  f_025: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: '허쉬컷 볼륨으로 절벽 커버',
  },
  f_026: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '웨이브로 모든 두상에 볼륨',
  },
  f_027: {
    suitableHeadShapes: { headShape: ['oval'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '매끈한 스타일은 균형잡힌 두상에 적합',
  },
  f_028: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['medium', 'large'] },
    recommendation: 'S컬로 볼륨 극대화',
  },
  f_029: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '볼륨 + 슬릭으로 절벽 커버',
  },
  f_030: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['medium', 'low'], backHeadShape: ['flat', 'round'], headSize: ['medium', 'large'] },
    recommendation: 'C컬로 뒷통수 보완',
  },
  f_031: {
    suitableHeadShapes: { headShape: ['oval'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '깔끔한 일자컷은 이상적인 두상에 적합',
  },
  f_032: {
    suitableHeadShapes: { headShape: ['round', 'oval'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '높은 레이어로 정수리 높은 분들에게',
  },
  f_033: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '매끈한 롱은 균형잡힌 두상에 적합',
  },
  f_034: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: '물결 웨이브로 볼륨 보완',
  },
  f_035: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['medium', 'low'], backHeadShape: ['flat', 'round'], headSize: ['medium', 'large'] },
    recommendation: 'C컬로 뒷통수 커버',
  },
  f_036: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '풍성한 웨이브로 모든 두상에 볼륨',
  },
  f_037: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['medium', 'large'] },
    recommendation: '자연스러운 웨이브로 절벽 커버',
  },

  // ====== 남성 스타일 ======
  m_001: {
    suitableHeadShapes: { headShape: ['round', 'oval'], crownHeight: ['medium', 'high'], backHeadShape: ['round', 'flat'], headSize: ['medium', 'large'] },
    recommendation: '사이드를 짧게 해서 큰 머리도 작아보임',
  },
  m_002: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '펌으로 정수리 볼륨 보완',
  },
  m_003: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '자연스러운 앞머리로 균형잡힌 두상에 적합',
  },
  m_004: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: '은은한 펌으로 볼륨 보완',
  },
  m_005: {
    suitableHeadShapes: { headShape: ['oval'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '넘긴 스타일은 이상적인 두상에 적합',
  },
  m_006: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '깔끔한 컷은 균형잡힌 두상에',
  },
  m_007: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '웨이브로 모든 두상에 볼륨',
  },
  m_008: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '가르마 스타일은 정수리 높은 분들에게',
  },
  m_009: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '자연스러운 스타일로 균형잡힌 두상에',
  },
  m_010: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: '다운펌으로 정수리 볼륨',
  },
  m_011: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '레이어로 절벽 커버',
  },
  m_012: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '깔끔한 숏컷은 균형잡힌 두상에',
  },
  m_013: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '시스루 앞머리로 정수리 높은 분들에게',
  },
  m_014: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '깔끔한 가일컷은 균형잡힌 두상에',
  },
  m_015: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['medium', 'large'] },
    recommendation: '사이드 짧게로 큰 머리도 커버',
  },
  m_016: {
    suitableHeadShapes: { headShape: ['oval', 'round'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '짧은 스타일은 균형잡힌 두상에',
  },
  m_017: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: '빈티지 웨이브로 볼륨 보완',
  },
  m_018: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '웨이브로 모든 두상에 볼륨',
  },
  m_019: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium'] },
    recommendation: '은은한 펌으로 자연스럽게 볼륨',
  },
  m_020: {
    suitableHeadShapes: { headShape: ['round', 'oval', 'flat'], crownHeight: ['low', 'medium'], backHeadShape: ['flat', 'round'], headSize: ['small', 'medium', 'large'] },
    recommendation: '자연스러운 웨이브로 절벽 커버',
  },
  m_021: {
    suitableHeadShapes: { headShape: ['oval'], crownHeight: ['medium', 'high'], backHeadShape: ['round'], headSize: ['small', 'medium'] },
    recommendation: '넘긴 스타일은 이상적인 두상에 적합',
  },
};

// 두상 관련 한글 라벨
export const headShapeLabels = {
  backHeadShape: { round: '둥근 뒷통수', flat: '절벽 (평평)' },
  crownHeight: { high: '정수리 높음', medium: '정수리 보통', low: '정수리 낮음' },
  headSize: { small: '작은 편', medium: '보통', large: '큰 편' },
};
