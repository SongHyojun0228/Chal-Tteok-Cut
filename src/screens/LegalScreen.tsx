import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';

const PRIVACY_POLICY = `찰떡컷 개인정보 처리방침

시행일: 2026년 2월 9일

"찰떡컷"(이하 "앱")은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.

1. 수집하는 개인정보 항목

가. 필수 수집 항목
• 이메일 주소, 비밀번호 (회원가입)
• 얼굴 사진 (얼굴형 분석용, 선택)
• 성별, 모질, 모량, 두피 타입, 머리 길이, 스타일링 시간, 스타일 선호 (프로필)

나. 자동 수집 항목
• 기기 정보 (OS 버전, 기기 모델)
• 앱 사용 로그

2. 개인정보의 수집 및 이용 목적

• 회원 관리: 본인 확인, 서비스 제공
• 얼굴형 분석: AI 기반 헤어스타일 추천
• 서비스 개선: 추천 알고리즘 고도화, 통계 분석
• 고객 지원: 문의 대응, 공지사항 전달

3. 개인정보의 보유 및 이용 기간

• 회원 탈퇴 시 즉시 파기
• 얼굴 사진: 분석 완료 후 Firebase Storage에 암호화 저장, 사용자 요청 시 즉시 삭제
• 관련 법령에 의한 보존: 계약 또는 청약철회에 관한 기록 5년

4. 개인정보의 제3자 제공

앱은 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.
다만, 다음의 경우에는 예외로 합니다:
• 이용자가 사전에 동의한 경우
• 법령의 규정에 의한 경우

5. 개인정보의 처리 위탁

앱은 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁합니다:
• Google Firebase: 데이터 저장, 인증, 이미지 저장
• Google Cloud Vision API: 얼굴 랜드마크 분석 (얼굴 이미지 전송)

6. 이용자의 권리

이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
• 개인정보 열람, 정정, 삭제 요구
• 개인정보 처리 정지 요구
• 얼굴 사진 삭제 (설정 > 얼굴 사진 삭제)
• 회원 탈퇴 (설정 > 회원 탈퇴)

7. 개인정보의 안전성 확보 조치

• 개인정보 암호화 (Firebase 보안 규칙)
• 접근 권한 관리 (인증된 사용자만 본인 데이터 접근)
• 얼굴 사진 접근 경로 제한 (본인 UID 폴더만 접근)

8. 개인정보 보호 책임자

• 이름: 찰떡컷 개발팀
• 이메일: support@chaltteok.com

9. 개인정보 처리방침의 변경

본 방침이 변경되는 경우 앱 내 공지를 통해 알려드립니다.`;

const TERMS_OF_SERVICE = `찰떡컷 이용약관

시행일: 2026년 2월 9일

제1조 (목적)
본 약관은 찰떡컷(이하 "앱")이 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.

제2조 (서비스의 내용)
앱은 다음과 같은 서비스를 제공합니다:
1. AI 기반 얼굴형 분석
2. 얼굴형·모질·선호도 기반 헤어스타일 추천
3. 스타일 저장 및 미용사 공유 기능
4. 사용자 프로필 관리

제3조 (회원가입)
1. 이용자는 앱이 정한 양식에 따라 회원정보를 기입하고, 본 약관에 동의함으로써 회원가입을 신청합니다.
2. 이메일 인증을 통해 본인 확인 후 서비스를 이용할 수 있습니다.

제4조 (서비스 이용)
1. 앱의 AI 분석 결과는 참고용이며, 실제 시술 결과와 다를 수 있습니다.
2. 헤어스타일 추천은 알고리즘에 기반한 것으로, 개인의 주관적 만족도와 차이가 있을 수 있습니다.
3. 이용자는 서비스를 통해 얻은 정보를 개인적인 용도로만 사용해야 합니다.

제5조 (이용자의 의무)
이용자는 다음 행위를 하여서는 안 됩니다:
1. 타인의 사진을 무단으로 분석하는 행위
2. 서비스를 통해 얻은 타인의 정보를 부당하게 이용하는 행위
3. 앱의 운영을 방해하는 행위
4. 기타 관련 법령에 위반되는 행위

제6조 (면책)
1. 앱은 AI 분석 결과의 정확성을 100% 보장하지 않습니다.
2. 앱은 추천 결과에 따른 시술 결과에 대해 책임지지 않습니다.
3. 천재지변, 서버 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임지지 않습니다.

제7조 (회원 탈퇴 및 자격 상실)
1. 이용자는 언제든지 앱 내 설정에서 회원 탈퇴를 신청할 수 있습니다.
2. 탈퇴 시 모든 개인정보와 분석 데이터는 즉시 삭제됩니다.

제8조 (저작권)
1. 앱이 제공하는 콘텐츠(스타일 이미지, 분석 결과 등)의 저작권은 앱에 귀속됩니다.
2. 이용자는 앱의 콘텐츠를 상업적으로 이용할 수 없습니다.

제9조 (분쟁 해결)
본 약관과 관련된 분쟁은 대한민국 법령에 따라 해결합니다.

제10조 (약관의 변경)
약관이 변경되는 경우 앱 내 공지를 통해 알려드리며, 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.`;

export default function LegalScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Legal'>>();
  const navigation = useNavigation();
  const type = route.params.type;

  const title = type === 'privacy' ? '개인정보 처리방침' : '이용약관';
  const content = type === 'privacy' ? PRIVACY_POLICY : TERMS_OF_SERVICE;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.content}>{content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  content: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});
