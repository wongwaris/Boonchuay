import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import OptionCard from '../components/OptionCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutLocation'>;

export default function WorkoutLocationScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<'home' | 'gym' | null>(profile.workoutLocation);

  return (
    <OnboardingLayout
      progress={73}
      title="Choose your workout location"
      onContinue={() => {
        if (!selected) return;
        update({ workoutLocation: selected });
        navigation.navigate('Equipment');
      }}
      continueDisabled={!selected}
    >
      <View style={{ gap: 10 }}>
        <OptionCard
          label="Home"
          selected={selected === 'home'}
          onPress={() => setSelected('home')}
          icon={<Ionicons name="home-outline" size={22} color="#fff" />}
          iconBg={colors.surface}
        />
        <OptionCard
          label="Gym"
          selected={selected === 'gym'}
          onPress={() => setSelected('gym')}
          icon={<MaterialCommunityIcons name="dumbbell" size={22} color="#fff" />}
          iconBg={colors.surface}
        />
      </View>
    </OnboardingLayout>
  );
}
