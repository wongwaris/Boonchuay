import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import ScrollPicker from '../components/ScrollPicker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TargetWeight'>;

const KG_VALUES = Array.from({ length: 251 }, (_, i) => i + 30);
const LBS_VALUES = Array.from({ length: 501 }, (_, i) => i + 66);

export default function TargetWeightScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [unit, setUnit] = useState<'kg' | 'lbs'>(profile.targetWeightUnit);
  const [kgIdx, setKgIdx] = useState(Math.max(0, profile.targetWeightValue - 30));
  const [lbsIdx, setLbsIdx] = useState(70);

  const currentKg = profile.currentWeightValue;
  const targetKg = unit === 'kg' ? KG_VALUES[kgIdx] : Math.round(LBS_VALUES[lbsIdx] / 2.205);
  const diff = targetKg - currentKg;
  const pct = currentKg > 0 ? Math.abs(Math.round((diff / currentKg) * 100)) : 0;

  const factText =
    diff < 0
      ? `Great goal: to lose ${pct}% of your weight.`
      : diff > 0
      ? `Great goal: to gain ${pct}% of your weight.`
      : 'Maintaining your current weight is a great goal!';

  const handleContinue = () => {
    const value = unit === 'kg' ? KG_VALUES[kgIdx] : LBS_VALUES[lbsIdx];
    update({ targetWeightValue: value, targetWeightUnit: unit });
    navigation.navigate('WaterIntake');
  };

  return (
    <OnboardingLayout
      progress={45}
      title="What is your target weight?"
      onContinue={handleContinue}
    >
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, unit === 'lbs' && styles.toggleBtnActive]}
          onPress={() => setUnit('lbs')}
        >
          <Text style={[styles.toggleText, unit === 'lbs' && styles.toggleTextActive]}>LBS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, unit === 'kg' && styles.toggleBtnActive]}
          onPress={() => setUnit('kg')}
        >
          <Text style={[styles.toggleText, unit === 'kg' && styles.toggleTextActive]}>KG</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerArea}>
        {unit === 'kg' ? (
          <ScrollPicker values={KG_VALUES} selectedIndex={kgIdx} onIndexChange={setKgIdx} suffix=" kg" />
        ) : (
          <ScrollPicker values={LBS_VALUES} selectedIndex={lbsIdx} onIndexChange={setLbsIdx} suffix=" lbs" />
        )}
      </View>

      {diff !== 0 && (
        <View style={styles.factCard}>
          <MaterialCommunityIcons name="scale-bathroom" size={24} color={colors.textSecondary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.factTitle}>{factText}</Text>
            <Text style={styles.factBody}>
              *Studies show even brief activity boosts health. Just 3–4 minutes of vigorous movement
              daily is linked with lower risk of heart disease and mortality.
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.ref}>📖 Study Reference: *Stamatakis et al., Nature Medicine, 2022</Text>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderRadius: 30, padding: 4, alignSelf: 'center', marginBottom: 20,
  },
  toggleBtn: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 26 },
  toggleBtnActive: { backgroundColor: colors.accent },
  toggleText: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
  toggleTextActive: { color: colors.text },
  pickerArea: { marginBottom: 18 },
  factCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 10,
  },
  factTitle: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  factBody: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  ref: { color: colors.textMuted, fontSize: 11 },
});
