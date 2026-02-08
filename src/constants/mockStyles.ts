export type StyleData = {
  id: string;
  name: string;
  category: string;
  matchScore: number;
  description: string;
  reason: string;
  difficulty: 1 | 2 | 3;
  maintenanceTime: number;
  priceRange: string;
  duration: string;
  careTips: string[];
  tags: string[];
  gender: 'male' | 'female' | 'unisex';
};

export const mockStyles: StyleData[] = [
  {
    id: 'style_001',
    name: '레이어드 미디엄',
    category: '중단발',
    matchScore: 95,
    description: '자연스러운 레이어드 컷으로 얼굴 라인을 부드럽게 감싸주는 스타일입니다. 볼륨감이 자연스럽게 살아나며, 다양한 스타일링이 가능해요.',
    reason: '얼굴형에 맞는 레이어로 갸름한 느낌을 줄 수 있어요',
    difficulty: 2,
    maintenanceTime: 10,
    priceRange: '80,000 ~ 120,000원',
    duration: '2~3개월',
    careTips: [
      '드라이 시 브러시로 안쪽으로 말아주세요',
      '볼륨 스프레이를 뿌리 쪽에 사용하면 효과적',
      '주 1회 트리트먼트 추천',
    ],
    tags: ['자연스러운', '여성스러운', '직장인'],
    gender: 'female',
  },
  {
    id: 'style_002',
    name: '시스루 뱅 보브컷',
    category: '단발',
    matchScore: 91,
    description: '투명한 앞머리와 턱선을 감싸는 보브컷의 조합. 이마와 얼굴 비율을 조절해주며 세련된 느낌을 줍니다.',
    reason: '시스루 뱅이 이마를 자연스럽게 커버해줘요',
    difficulty: 2,
    maintenanceTime: 15,
    priceRange: '60,000 ~ 90,000원',
    duration: '1.5~2개월',
    careTips: [
      '앞머리는 매직기로 살짝 다려주세요',
      '볼륨이 죽지 않도록 엎어서 드라이',
      '끝부분 C컬은 고데기로 살짝',
    ],
    tags: ['트렌디', '청순한', '데이트'],
    gender: 'female',
  },
  {
    id: 'style_003',
    name: '웨이브 펌 롱',
    category: '긴머리',
    matchScore: 87,
    description: '부드러운 S컬 웨이브가 자연스럽게 흐르는 롱 스타일. 여성스러우면서도 볼륨감이 풍성해 보이는 효과가 있어요.',
    reason: '웨이브가 볼륨을 만들어 모량이 풍성해 보여요',
    difficulty: 3,
    maintenanceTime: 20,
    priceRange: '120,000 ~ 180,000원',
    duration: '3~4개월',
    careTips: [
      '젖은 머리에 무스를 도포 후 자연건조',
      '디퓨저 사용하면 웨이브 유지에 좋아요',
      '주 2회 헤어팩으로 수분 보충',
    ],
    tags: ['여성스러운', '화려한', '파티'],
    gender: 'female',
  },
  {
    id: 'style_004',
    name: '투블럭 댄디컷',
    category: '숏컷',
    matchScore: 93,
    description: '옆과 뒤는 짧게, 윗머리는 볼륨감 있게 올리는 깔끔한 남성 스타일. 직장인부터 학생까지 누구에게나 어울려요.',
    reason: '깔끔한 실루엣이 얼굴형을 정돈해줘요',
    difficulty: 1,
    maintenanceTime: 5,
    priceRange: '15,000 ~ 25,000원',
    duration: '1~1.5개월',
    careTips: [
      '왁스로 앞머리를 올려주세요',
      '사이드는 3주마다 다듬기 추천',
      '매트한 왁스가 자연스러워요',
    ],
    tags: ['깔끔한', '직장인', '데일리'],
    gender: 'male',
  },
  {
    id: 'style_005',
    name: '텍스처 펌',
    category: '미디엄',
    matchScore: 89,
    description: '자연스러운 움직임을 주는 남성 펌 스타일. 손으로 쓸어올리기만 해도 스타일링이 완성되는 편리한 헤어입니다.',
    reason: '자연스러운 볼륨으로 세련된 느낌을 줘요',
    difficulty: 1,
    maintenanceTime: 5,
    priceRange: '40,000 ~ 60,000원',
    duration: '2~3개월',
    careTips: [
      '드라이 후 왁스를 살짝 발라주세요',
      '손으로 비벼가며 자연스럽게 스타일링',
      '너무 많은 제품은 오히려 역효과',
    ],
    tags: ['자연스러운', '트렌디', '캐주얼'],
    gender: 'male',
  },
];
