import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import OptionCard from '../components/OptionCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';

type Props = NativeStackScreenProps<RootStackParamList, 'FitnessLevel'>;

const LEVELS = [
  {
    id: 'beginner',
    label: "I'm just starting out",
    description: 'New to fitness or getting back into it',
  },
  {
    id: 'intermediate',
    label: 'I work out a few times a week',
    description: 'Comfortable with basic exercises',
  },
  {
    id: 'regular',
    label: 'I train regularly',
    description: 'Experienced with structured programs',
  },
  {
    id: 'athlete',
    label: "I'm a competitive athlete",
    description: 'Training at a high performance level',
  },
];

export default function FitnessLevelScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string | null>(profile.fitnessLevel);

  return (
    <OnboardingLayout
      progress={14}
      title="What is your fitness level?"
      onContinue={() => {
        if (!selected) return;
        update({ fitnessLevel: selected as any });
        navigation.navigate('TargetZones');
      }}
      continueDisabled={!selected}
    >
      <View style={{ gap: 2 }}>
        {LEVELS.map((l) => (
          <OptionCard
            key={l.id}
            label={l.label}
            description={l.description}
            selected={selected === l.id}
            onPress={() => setSelected(l.id)}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
