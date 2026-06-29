import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Injuries'>;

const INJURIES = [
  { id: 'knee_pain', label: 'Knee pain', iconName: 'bone' },
  { id: 'upper_back', label: 'Upper back pain', iconName: 'human-handsup' },
  { id: 'lower_back', label: 'Lower back pain', iconName: 'human' },
  { id: 'elbow_pain', label: 'Elbow pain', iconName: 'arm-flex-outline' },
];

const NO_INJURY = 'no_injury';

export default function InjuriesScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string[]>(
    profile.injuries.length === 0 ? [NO_INJURY] : profile.injuries,
  );

  const toggle = (id: string) => {
    if (id === NO_INJURY) {
      setSelected([NO_INJURY]);
      return;
    }
    setSelected((prev) => {
      const without = prev.filter((x) => x !== NO_INJURY);
      return without.includes(id) ? without.filter((x) => x !== id) : [...without, id];
    });
  };

  const isNoInjury = selected.includes(NO_INJURY);

  return (
    <OnboardingLayout
      progress={23}
      title="Do you struggle with the following?"
      onContinue={() => {
        update({ injuries: isNoInjury ? [] : selected });
        navigation.navigate('WorkoutDuration');
      }}
    >
      <View style={{ gap: 10 }}>
        {INJURIES.map((inj) => {
          const sel = selected.includes(inj.id);
          return (
            <TouchableOpacity
              key={inj.id}
              style={[styles.card, sel && styles.cardSelected]}
              onPress={() => toggle(inj.id)}
              activeOpacity={0.8}
            >
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name={inj.iconName as any}
                  size={22}
                  color="#fff"
                />
              </View>
              <Text style={styles.cardLabel}>{inj.label}</Text>
              <View style={[styles.radio, sel && styles.radioSelected]}>
                {sel && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* No injuries option */}
        <TouchableOpacity
          style={[styles.card, styles.noInjuryCard, isNoInjury && styles.noInjuryCardSelected]}
          onPress={() => toggle(NO_INJURY)}
          activeOpacity={0.8}
        >
          <View style={[styles.iconBox, { backgroundColor: '#0F3320' }]}>
            <MaterialCommunityIcons name="shield-check" size={22} color="#22C55E" />
          </View>
          <Text style={styles.cardLabel}>I don't have any injuries</Text>
          <View style={[styles.radio, isNoInjury && styles.radioSuccess]}>
            {isNoInjury && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
        </TouchableOpacity>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: 'transparent',
  },
  cardSelected: { backgroundColor: colors.cardSelected, borderColor: colors.borderSelected },
  noInjuryCard: {},
  noInjuryCardSelected: { backgroundColor: '#0F3320', borderColor: '#22C55E' },
  iconBox: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#5C2020',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  cardLabel: { color: colors.text, fontSize: 15, flex: 1, fontWeight: '500' },
  radio: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2,
    borderColor: colors.textMuted, justifyContent: 'center', alignItems: 'center',
  },
  radioSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  radioSuccess: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
});
