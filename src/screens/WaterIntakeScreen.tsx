import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import OptionCard from '../components/OptionCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'WaterIntake'>;

const OPTIONS = [
  { id: 'less2', label: 'Less than 2 glasses' },
  { id: '2-6', label: '2-6 glasses' },
  { id: '7-10', label: '7-10 glasses' },
  { id: '10plus', label: 'More than 10 glasses' },
  { id: 'coffee', label: 'I only drink coffee or tea' },
];

export default function WaterIntakeScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string | null>(profile.waterIntake);

  return (
    <OnboardingLayout
      progress={50}
      title="How much water do you drink daily?"
      onContinue={() => {
        if (!selected) return;
        update({ waterIntake: selected });
        navigation.navigate('HydrationReminder');
      }}
      continueDisabled={!selected}
    >
      <View style={{ gap: 2 }}>
        {OPTIONS.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={selected === o.id}
            onPress={() => setSelected(o.id)}
            icon={
              o.id === 'coffee' ? (
                <Ionicons name="cafe-outline" size={20} color="#fff" />
              ) : (
                <Ionicons name="water-outline" size={20} color="#fff" />
              )
            }
            iconBg={o.id === 'coffee' ? colors.amberBg : colors.surface}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
