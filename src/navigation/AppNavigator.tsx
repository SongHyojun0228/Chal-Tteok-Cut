import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';
import { RootStackParamList, ProfileFlowParamList, MainTabParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { hasProfile } from '../services/userService';

// Screens
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import CameraScreen from '../screens/CameraScreen';
import QuestionsScreen from '../screens/QuestionsScreen';
import AnalyzingScreen from '../screens/AnalyzingScreen';
import ResultScreen from '../screens/ResultScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StyleDetailScreen from '../screens/StyleDetailScreen';
import LegalScreen from '../screens/LegalScreen';
import FAQScreen from '../screens/FAQScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileFlowParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 프로필 생성 플로우
function ProfileFlow() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <ProfileStack.Screen name="Camera" component={CameraScreen} />
      <ProfileStack.Screen name="Questions" component={QuestionsScreen} />
      <ProfileStack.Screen
        name="Analyzing"
        component={AnalyzingScreen}
        options={{ gestureEnabled: false }}
      />
    </ProfileStack.Navigator>
  );
}

// 하단 탭 네비게이터
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Result"
        component={ResultScreen}
        options={{
          tabBarLabel: '추천',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>✂️</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '프로필',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '설정',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// 루트 네비게이터
export default function AppNavigator() {
  const { user, loading } = useAuth();
  const [profileExists, setProfileExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      hasProfile(user.uid).then(setProfileExists);
    } else {
      setProfileExists(null);
    }
  }, [user]);

  // Firebase 로딩 중 or 프로필 체크 중
  if (loading || (user && profileExists === null)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>✂️</Text>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!user ? (
          // 비로그인
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : profileExists ? (
          // 로그인 + 프로필 있음 → 바로 메인
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ProfileFlow" component={ProfileFlow} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen
              name="StyleDetail"
              component={StyleDetailScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                headerTitle: '스타일 상세',
                headerTintColor: Colors.textPrimary,
              }}
            />
            <Stack.Screen
              name="Legal"
              component={LegalScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="FAQ"
              component={FAQScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        ) : (
          // 로그인 + 프로필 없음 → 온보딩부터
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="ProfileFlow" component={ProfileFlow} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="StyleDetail"
              component={StyleDetailScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                headerTitle: '스타일 상세',
                headerTintColor: Colors.textPrimary,
              }}
            />
            <Stack.Screen
              name="Legal"
              component={LegalScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="FAQ"
              component={FAQScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
