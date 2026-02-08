import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { mockStyles } from '../constants/mockStyles';
import StyleCard from '../components/StyleCard';

export default function ResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.greeting}>찰떡같이 어울리는</Text>
        <Text style={styles.title}>맞춤 스타일 추천 ✂️</Text>
        <Text style={styles.subtitle}>
          AI가 분석한 Top {mockStyles.length} 스타일이에요
        </Text>
      </View>

      {/* 스타일 카드 리스트 */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {mockStyles.map((item, index) => (
          <View key={item.id}>
            {/* 순위 표시 */}
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>
                {index + 1}위
              </Text>
            </View>
            <StyleCard
              style={item}
              onPress={() => navigation.navigate('StyleDetail', { styleId: item.id })}
            />
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            더 많은 스타일은 곧 업데이트될 예정이에요!
          </Text>
        </View>
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
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  rankBadge: {
    marginLeft: 28,
    marginBottom: 8,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
