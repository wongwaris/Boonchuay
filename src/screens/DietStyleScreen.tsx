import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import OptionCard from '../components/OptionCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'DietStyle'>;

const DIETS = [
  {
    id: 'general',
    label: 'General',
    description: 'Balanced nutrition with flexible food choices',
    iconBg: '#1E3460',
    icon: <MaterialCommunityIcons name="food-fork-drink" size={20} color="#fff" />,
  },
  {
    id: 'mediterranean',
    label: 'Mediterranean',
    description: 'Heart-healthy with olive oil, fish, and whole grains',
    iconBg: '#0F3320',
    icon: <MaterialCommunityIcons name="food-fork-drink" size={20} color="#22C55E" />,
  },
  {
    id: 'flexitarian',
    label: 'Flexitarian',
    description: 'Plant-focused with occasional meat and fish',
    iconBg: '#0F2F20',
    icon: <MaterialCommunityIcons name="leaf" size={20} color="#22C55E" />,
  },
  {
    id: 'vegetarian',
    label: 'Vegetarian',
    description: 'Plant-based meals without meat or fish',
    iconBg: '#0F2A10',
    icon: <MaterialCommunityIcons name="sprout" size={20} color="#22C55E" />,
  },
];

export default function DietStyleScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string | null>(profile.dietStyle);

  return (
    <OnboardingLayout
      progress={59}
      title="Choose your diet style"
      onContinue={() => {
        if (!selected) return;
        update({ dietStyle: selected });
        navigation.navigate('TrainingDays');
      }}
      continueDisabled={!selected}
      scrollable
    >
      <View style={{ gap: 2 }}>
        {DIETS.map((d) => (
          <OptionCard
            key={d.id}
            label={d.label}
            description={d.description}
            selected={selected === d.id}
            onPress={() => setSelected(d.id)}
            icon={d.icon}
            iconBg={d.iconBg}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
