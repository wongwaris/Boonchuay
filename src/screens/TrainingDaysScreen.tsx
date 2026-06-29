import React, { useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import OptionCard from '../components/OptionCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TrainingDays'>;

const OPTIONS = [
  { id: 3, label: '3 days per week' },
  { id: 4, label: '4 days per week' },
  { id: 5, label: '5 days per week' },
];

export default function TrainingDaysScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<number | null>(profile.trainingDays);

  return (
    <OnboardingLayout
      progress={64}
      title="How many days per week do you want to train?"
      onContinue={() => {
        if (!selected) return;
        update({ trainingDays: selected });
        navigation.navigate('TrainingTime');
      }}
      continueDisabled={!selected}
    >
      <View style={{ gap: 10 }}>
        {OPTIONS.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={selected === o.id}
            onPress={() => setSelected(o.id)}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
