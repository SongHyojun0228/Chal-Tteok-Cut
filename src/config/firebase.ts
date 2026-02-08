import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyC-Xj5wd_ukjdn5S07vvJRVT3ma9g8qhXw",
  authDomain: "chaltteok-cut.firebaseapp.com",
  projectId: "chaltteok-cut",
  storageBucket: "chaltteok-cut.firebasestorage.app",
  messagingSenderId: "687389796866",
  appId: "1:687389796866:web:d4e8b461a3adaba060551b",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Auth 초기화 (React Native에서는 AsyncStorage로 세션 유지)
const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

// Firestore (유저 데이터 저장)
const db = getFirestore(app);

// Storage (얼굴 이미지 저장)
const storage = getStorage(app);

export { app, auth, db, storage };
