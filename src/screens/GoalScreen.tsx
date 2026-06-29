import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import OptionCard from '../components/OptionCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Goal'>;

const GOALS = [
  {
    id: 'lose_weight',
    label: 'Lose weight',
    icon: <MaterialCommunityIcons name="scale-bathroom" size={22} color="#fff" />,
    iconBg: '#5C2020',
  },
  {
    id: 'gain_muscle',
    label: 'Gain Muscle',
    icon: <MaterialCommunityIcons name="arm-flex" size={22} color="#fff" />,
    iconBg: '#1E3460',
  },
  {
    id: 'increase_strength',
    label: 'Increase strength',
    icon: <MaterialCommunityIcons name="weight-lifter" size={22} color="#fff" />,
    iconBg: '#3A2A0A',
  },
];

export default function GoalScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string | null>(profile.goal);

  return (
    <OnboardingLayout
      progress={9}
      title="What is your main goal?"
      onContinue={() => {
        if (!selected) return;
        update({ goal: selected as any });
        navigation.navigate('FitnessLevel');
      }}
      continueDisabled={!selected}
    >
      <View style={styles.options}>
        {GOALS.map((g) => (
          <OptionCard
            key={g.id}
            label={g.label}
            selected={selected === g.id}
            onPress={() => setSelected(g.id)}
            icon={g.icon}
            iconBg={g.iconBg}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  options: { gap: 2 },
});
