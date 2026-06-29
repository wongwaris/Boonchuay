import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import OptionCard from '../components/OptionCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TrainingTime'>;

const OPTIONS = [
  {
    id: 'morning', label: 'Morning',
    icon: <Ionicons name="flame-outline" size={20} color="#fff" />,
    iconBg: '#3A2010',
  },
  {
    id: 'midday', label: 'Midday',
    icon: <Ionicons name="time-outline" size={20} color="#fff" />,
    iconBg: colors.surface,
  },
  {
    id: 'evening', label: 'Evening',
    icon: <MaterialCommunityIcons name="run" size={20} color="#fff" />,
    iconBg: colors.surface,
  },
  {
    id: 'none', label: 'No preference',
    icon: <MaterialCommunityIcons name="auto-fix" size={20} color="#fff" />,
    iconBg: colors.purpleBg,
  },
];

export default function TrainingTimeScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string | null>(profile.trainingTime);

  return (
    <OnboardingLayout
      progress={68}
      title="Preferred training time"
      onContinue={() => {
        if (!selected) return;
        update({ trainingTime: selected });
        navigation.navigate('WorkoutLocation');
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
            icon={o.icon}
            iconBg={o.iconBg}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
