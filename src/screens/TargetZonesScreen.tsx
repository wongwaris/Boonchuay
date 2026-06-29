import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import BodyModelSVG from '../components/BodyModelSVG';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TargetZones'>;

export default function TargetZonesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string[]>(profile.targetZones ?? []);

  const toggle = (id: string) => {
    if (id === 'FULL BODY') {
      setSelected((prev) => (prev.includes('FULL BODY') ? [] : ['FULL BODY']));
      return;
    }
    setSelected((prev) => {
      const without = prev.filter((z) => z !== 'FULL BODY');
      return without.includes(id)
        ? without.filter((z) => z !== id)
        : [...without, id];
    });
  };

  const canContinue = selected.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MY PROFILE</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Your plan is 18% personalized</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '18%' }]} />
        </View>
      </View>

      <Text style={styles.title}>What are your target zones?</Text>
      <Text style={styles.subtitle}>Choose all that apply.</Text>

      <BodyModelSVG selected={selected} onToggle={toggle} />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
          onPress={() => {
            update({ targetZones: selected });
            navigation.navigate('Injuries');
          }}
          disabled={!canContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4,
  },
  backBtn: { width: 38, height: 38, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: colors.text, fontSize: 15, fontWeight: '600', letterSpacing: 1 },
  progressContainer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  progressText: { color: colors.textSecondary, fontSize: 13, marginBottom: 8 },
  progressTrack: { height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', textAlign: 'center', marginTop: 16, marginBottom: 4 },
  subtitle: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 12 },
  footer: { paddingHorizontal: 20, paddingTop: 8 },
  continueBtn: { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 17, alignItems: 'center' },
  continueBtnDisabled: { opacity: 0.4 },
  continueBtnText: { color: colors.text, fontSize: 15, fontWeight: '700', letterSpacing: 1.5 },
});
