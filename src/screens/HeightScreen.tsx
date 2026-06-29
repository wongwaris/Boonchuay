import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import ScrollPicker from '../components/ScrollPicker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Height'>;

const CM_VALUES = Array.from({ length: 121 }, (_, i) => i + 100); // 100-220 cm
const FT_VALUES = ['4\'0"', '4\'1"', '4\'2"', '4\'3"', '4\'4"', '4\'5"', '4\'6"', '4\'7"', '4\'8"', '4\'9"', '4\'10"', '4\'11"', '5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"', '6\'5"'];

export default function HeightScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [unit, setUnit] = useState<'cm' | 'ft'>(profile.heightUnit);
  const [cmIndex, setCmIndex] = useState(profile.heightValue - 100);
  const [ftIndex, setFtIndex] = useState(12); // default 5'0"

  const handleContinue = () => {
    if (unit === 'cm') {
      update({ heightValue: CM_VALUES[cmIndex], heightUnit: 'cm' });
    } else {
      update({ heightValue: ftIndex, heightUnit: 'ft' });
    }
    navigation.navigate('CurrentWeight');
  };

  return (
    <OnboardingLayout
      progress={36}
      title="What is your height?"
      onContinue={handleContinue}
    >
      {/* Unit toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, unit === 'ft' && styles.toggleBtnActive]}
          onPress={() => setUnit('ft')}
        >
          <Text style={[styles.toggleText, unit === 'ft' && styles.toggleTextActive]}>FT/IN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, unit === 'cm' && styles.toggleBtnActive]}
          onPress={() => setUnit('cm')}
        >
          <Text style={[styles.toggleText, unit === 'cm' && styles.toggleTextActive]}>CM</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerArea}>
        {unit === 'cm' ? (
          <ScrollPicker
            values={CM_VALUES}
            selectedIndex={cmIndex}
            onIndexChange={setCmIndex}
            suffix=" cm"
          />
        ) : (
          <ScrollPicker
            values={FT_VALUES}
            selectedIndex={ftIndex}
            onIndexChange={setFtIndex}
          />
        )}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 30,
    padding: 4,
    alignSelf: 'center',
    marginBottom: 32,
  },
  toggleBtn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 26,
  },
  toggleBtnActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  toggleTextActive: {
    color: colors.text,
  },
  pickerArea: {
    flex: 1,
    justifyContent: 'center',
  },
});
