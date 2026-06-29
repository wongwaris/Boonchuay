import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import OptionCard from '../components/OptionCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDuration'>;

const DURATIONS = [
  { id: '10-15', label: '10-15 MIN' },
  { id: '20-30', label: '20-30 MIN' },
  { id: '30-40', label: '30-40 MIN' },
  { id: '40-60', label: '40-60 MIN' },
  { id: 'auto', label: 'Let FitEasy Decide' },
];

export default function WorkoutDurationScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string | null>(profile.workoutDuration);

  return (
    <OnboardingLayout
      progress={27}
      title="How long do you want your workouts to be?"
      subtitle="Choose all that apply."
      onContinue={() => {
        if (!selected) return;
        update({ workoutDuration: selected });
        navigation.navigate('ScienceFact');
      }}
      continueDisabled={!selected}
    >
      <View style={{ gap: 2 }}>
        {DURATIONS.map((d) => (
          <OptionCard
            key={d.id}
            label={d.label}
            selected={selected === d.id}
            onPress={() => setSelected(d.id)}
            icon={
              d.id === 'auto' ? (
                <MaterialCommunityIcons name="auto-fix" size={20} color="#fff" />
              ) : (
                <Ionicons name="timer-outline" size={20} color="#fff" />
              )
            }
            iconBg={d.id === 'auto' ? colors.purpleBg : colors.surface}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
