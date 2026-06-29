import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import LongevityChart from '../components/LongevityChart';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ScienceFact'>;

export default function ScienceFactScreen({ navigation }: Props) {
  return (
    <OnboardingLayout
      progress={32}
      title="Studies on workout longevity!"
      onContinue={() => navigation.navigate('Height')}
    >
      <View style={styles.chartWrapper}>
        <LongevityChart />
      </View>

      <View style={styles.factCard}>
        <MaterialCommunityIcons name="arm-flex" size={28} color={colors.accent} />
        <Text style={styles.factText}>
          Studies show that doing 30–60 minutes/week of muscle-strengthening activities lowers
          mortality rate from 10–30%!
        </Text>
      </View>

      <View style={styles.refRow}>
        <Text style={styles.refIcon}>📖</Text>
        <Text style={styles.refText}>
          Study Reference: 35228201; 35599175; 29425700
        </Text>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 18,
    overflow: 'hidden',
  },
  factCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    marginBottom: 14,
  },
  factText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refIcon: { fontSize: 14 },
  refText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
