import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';
import { RootStackParamList, ProfileFlowParamList, MainTabParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';

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

const Stack = createNativeStackNavigator<RootStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileFlowParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 프로필 생성 플로우
function ProfileFlow() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
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

  // Firebase 로딩 중
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>✂️</Text>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // 로그인 됨
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
          </>
        ) : (
          // 비로그인
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
