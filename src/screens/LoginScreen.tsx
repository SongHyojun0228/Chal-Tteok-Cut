import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { Colors } from '../constants/colors';

function validatePassword(password: string): string | null {
  if (password.length < 8) return '비밀번호는 8자 이상이어야 해요';
  if (!/[A-Za-z]/.test(password)) return '영문자를 포함해야 해요';
  if (!/[0-9]/.test(password)) return '숫자를 포함해야 해요';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    return '특수문자를 포함해야 해요 (!@#$% 등)';
  return null;
}

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 성공 모달
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successName, setSuccessName] = useState('');

  const handleSubmit = async () => {
    // 회원가입 시 이름 필수
    if (isSignUp && !name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요');
      return;
    }

    if (!email || !password) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요');
      return;
    }

    // 비밀번호 유효성 검사
    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('비밀번호 조건', passwordError);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않아요');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Firebase에 이름 저장
        await updateProfile(userCredential.user, { displayName: name.trim() });
        setSuccessName(name.trim());
        setSuccessMessage('회원가입 완료!');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setSuccessName(userCredential.user.displayName || '');
        setSuccessMessage('로그인 성공!');
      }
      setShowSuccessModal(true);
    } catch (error: any) {
      let message = '오류가 발생했어요. 다시 시도해주세요.';
      if (error.code === 'auth/email-already-in-use') {
        message = '이미 가입된 이메일이에요';
      } else if (error.code === 'auth/invalid-email') {
        message = '올바른 이메일 형식이 아니에요';
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = '이메일 또는 비밀번호가 틀렸어요';
      } else if (error.code === 'auth/user-not-found') {
        message = '가입되지 않은 이메일이에요';
      }
      Alert.alert('알림', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* 로고 */}
        <View style={styles.logoArea}>
          <Text style={styles.logoEmoji}>✂️</Text>
          <Text style={styles.logoText}>찰떡컷</Text>
          <Text style={styles.logoSubtext}>찰떡같이 어울리는 헤어컷</Text>
        </View>

        {/* 폼 */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {isSignUp ? '회원가입' : '로그인'}
          </Text>

          {/* 이름 (회원가입 시만) */}
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="이름"
              placeholderTextColor={Colors.textLight}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="이메일"
            placeholderTextColor={Colors.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor={Colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* 비밀번호 조건 안내 */}
          {isSignUp && (
            <View style={styles.passwordRules}>
              <PasswordRule label="8자 이상" met={password.length >= 8} />
              <PasswordRule label="영문 포함" met={/[A-Za-z]/.test(password)} />
              <PasswordRule label="숫자 포함" met={/[0-9]/.test(password)} />
              <PasswordRule label="특수문자 포함" met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)} />
            </View>
          )}

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인"
              placeholderTextColor={Colors.textLight}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? '잠시만...' : isSignUp ? '가입하기' : '로그인'}
            </Text>
          </TouchableOpacity>

          {/* 전환 */}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setConfirmPassword('');
              setName('');
            }}
          >
            <Text style={styles.switchText}>
              {isSignUp
                ? '이미 계정이 있나요? 로그인'
                : '계정이 없나요? 회원가입'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* PWA 설치 안내 (웹에서만) */}
        {Platform.OS === 'web' && (
          <View style={styles.pwaBanner}>
            <Text style={styles.pwaBannerTitle}>📲 앱으로 설치하면 더 편해요</Text>
            <Text style={styles.pwaBannerDesc}>
              {/iPad|iPhone|iPod/.test(navigator?.userAgent || '')
                ? 'Safari 하단 공유 버튼(□↑) → "홈 화면에 추가"'
                : 'Chrome 메뉴(⋮) → "홈 화면에 추가"'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 성공 모달 */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>{successMessage}</Text>
            <Text style={styles.modalSubtext}>
              {successName
                ? `${successName}님, 환영해요!`
                : '찰떡컷에 오신 걸 환영해요!'}
            </Text>
            <Text style={styles.modalDesc}>
              이제 나에게 딱 맞는 스타일을 찾아볼까요?
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function PasswordRule({ label, met }: { label: string; met: boolean }) {
  return (
    <View style={styles.ruleRow}>
      <Text style={[styles.ruleIcon, met && styles.ruleIconMet]}>
        {met ? '✓' : '○'}
      </Text>
      <Text style={[styles.ruleText, met && styles.ruleTextMet]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  logoSubtext: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordRules: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ruleIcon: {
    fontSize: 12,
    color: Colors.textLight,
    marginRight: 4,
  },
  ruleIconMet: {
    color: Colors.success,
  },
  ruleText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  ruleTextMet: {
    color: Colors.success,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  pwaBanner: {
    marginTop: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pwaBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  pwaBannerDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // 성공 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 28,
    padding: 36,
    alignItems: 'center',
    width: '100%',
  },
  modalEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  modalSubtext: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
