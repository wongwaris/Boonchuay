import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import ScrollPicker from '../components/ScrollPicker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CurrentWeight'>;

const KG_VALUES = Array.from({ length: 251 }, (_, i) => i + 30);   // 30–280 kg
const LBS_VALUES = Array.from({ length: 501 }, (_, i) => i + 66);  // 66–566 lbs

export default function CurrentWeightScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [unit, setUnit] = useState<'kg' | 'lbs'>(profile.currentWeightUnit);
  const [kgIdx, setKgIdx] = useState(Math.max(0, profile.currentWeightValue - 30));
  const [lbsIdx, setLbsIdx] = useState(70);

  const handleContinue = () => {
    const value = unit === 'kg' ? KG_VALUES[kgIdx] : LBS_VALUES[lbsIdx];
    update({ currentWeightValue: value, currentWeightUnit: unit });
    navigation.navigate('TargetWeight');
  };

  return (
    <OnboardingLayout
      progress={41}
      title="What is your current weight?"
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
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderRadius: 30, padding: 4, alignSelf: 'center', marginBottom: 32,
  },
  toggleBtn: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 26 },
  toggleBtnActive: { backgroundColor: colors.accent },
  toggleText: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
  toggleTextActive: { color: colors.text },
  pickerArea: { flex: 1, justifyContent: 'center' },
});
