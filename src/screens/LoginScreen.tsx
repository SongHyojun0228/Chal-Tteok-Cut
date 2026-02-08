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
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { Colors } from '../constants/colors';

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않아요');
      return;
    }

    if (password.length < 6) {
      Alert.alert('알림', '비밀번호는 6자 이상이어야 해요');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // 성공하면 AuthContext가 자동으로 감지 → 화면 전환
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
            }}
          >
            <Text style={styles.switchText}>
              {isSignUp
                ? '이미 계정이 있나요? 로그인'
                : '계정이 없나요? 회원가입'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
});
