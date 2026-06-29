import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardingLayout from '../components/OnboardingLayout';
import OptionCard from '../components/OptionCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'HydrationReminder'>;

const OPTIONS = [
  { id: '2h', label: 'Every 2 hours', description: 'Stay consistently hydrated all day' },
  { id: '3day', label: '3 times a day', description: 'Morning, afternoon & evening' },
  { id: 'me', label: 'Morning & Evening', description: 'A gentle start and end to your day' },
];

export default function HydrationReminderScreen({ navigation }: Props) {
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string | null>(profile.hydrationReminder);

  const goNext = (val: string | null) => {
    update({ hydrationReminder: val });
    navigation.navigate('DietStyle');
  };

  return (
    <OnboardingLayout
      progress={55}
      title="Stay hydrated with reminders"
      subtitle={
        profile.waterIntake === '10plus'
          ? "You're well-hydrated! Reminders can help you stay consistent every day."
          : 'Staying hydrated improves performance and recovery.'
      }
      onContinue={() => goNext(selected)}
      continueDisabled={!selected}
    >
      <View style={{ gap: 10 }}>
        {OPTIONS.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            description={o.description}
            selected={selected === o.id}
            onPress={() => setSelected(o.id)}
            icon={
              o.id === '2h' ? (
                <Ionicons name="timer-outline" size={20} color="#fff" />
              ) : o.id === '3day' ? (
                <Ionicons name="sunny-outline" size={20} color="#fff" />
              ) : (
                <Ionicons name="moon-outline" size={20} color="#fff" />
              )
            }
            iconBg={colors.surface}
          />
        ))}

        <TouchableOpacity
          style={styles.noThanks}
          onPress={() => goNext(null)}
          activeOpacity={0.7}
        >
          <Text style={styles.noThanksText}>No thanks</Text>
        </TouchableOpacity>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  noThanks: { alignItems: 'center', paddingVertical: 14 },
  noThanksText: { color: colors.textSecondary, fontSize: 15 },
});
