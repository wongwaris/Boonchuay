import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { G, Circle, Rect, Ellipse } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Gender'>;

function MaleBody({ color = '#fff' }) {
  return (
    <Svg width={110} height={200} viewBox="0 0 100 210">
      <G fill="none" stroke={color} strokeWidth={2}>
        <Circle cx={50} cy={22} r={18} />
        <Rect x={42} y={40} width={16} height={11} rx={3} />
        <Rect x={22} y={51} width={56} height={10} rx={5} />
        <Rect x={11} y={51} width={20} height={62} rx={10} />
        <Rect x={69} y={51} width={20} height={62} rx={10} />
        <Rect x={8} y={115} width={17} height={52} rx={8} />
        <Rect x={75} y={115} width={17} height={52} rx={8} />
        <Rect x={24} y={61} width={52} height={72} rx={9} />
        <Rect x={26} y={133} width={22} height={68} rx={11} />
        <Rect x={52} y={133} width={22} height={68} rx={11} />
        <Rect x={27} y={203} width={20} height={4} rx={2} />
        <Rect x={53} y={203} width={20} height={4} rx={2} />
      </G>
    </Svg>
  );
}

function FemaleBody({ color = '#fff' }) {
  return (
    <Svg width={90} height={200} viewBox="0 0 80 210">
      <G fill="none" stroke={color} strokeWidth={2}>
        <Circle cx={40} cy={19} r={15} />
        <Rect x={33} y={34} width={14} height={10} rx={3} />
        <Rect x={20} y={44} width={40} height={8} rx={4} />
        <Rect x={11} y={44} width={16} height={55} rx={8} />
        <Rect x={53} y={44} width={16} height={55} rx={8} />
        <Rect x={9} y={101} width={14} height={45} rx={7} />
        <Rect x={57} y={101} width={14} height={45} rx={7} />
        <Rect x={22} y={52} width={36} height={50} rx={10} />
        <Ellipse cx={40} cy={118} rx={22} ry={14} />
        <Rect x={20} y={128} width={18} height={72} rx={10} />
        <Rect x={42} y={128} width={18} height={72} rx={10} />
        <Ellipse cx={29} cy={204} rx={12} ry={5} />
        <Ellipse cx={51} cy={204} rx={12} ry={5} />
      </G>
    </Svg>
  );
}

const options = [
  { id: 'male', label: 'MALE', body: MaleBody },
  { id: 'female', label: 'FEMALE', body: FemaleBody },
];

export default function GenderScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string | null>(profile.gender);

  const handleContinue = () => {
    if (!selected && selected !== 'prefer_not') return;
    update({ gender: selected as any });
    navigation.navigate('Goal');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>

      <Text style={styles.title}>Select gender to start</Text>

      <View style={styles.cards}>
        {options.map(({ id, label, body: BodySvg }) => {
          const sel = selected === id;
          return (
            <TouchableOpacity
              key={id}
              style={[styles.genderCard, sel && styles.genderCardSelected]}
              onPress={() => setSelected(id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.genderLabel, sel && styles.genderLabelSelected]}>{label}</Text>
              <View style={styles.bodyContainer}>
                <BodySvg color={sel ? '#fff' : 'rgba(255,255,255,0.45)'} />
              </View>
              <View style={[styles.radio, sel && styles.radioSelected]}>
                {sel && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.preferCard, selected === 'prefer_not' && styles.preferCardSelected]}
        onPress={() => setSelected('prefer_not')}
        activeOpacity={0.8}
      >
        <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
        <Text style={styles.preferText}>Prefer not to say</Text>
        <View style={[styles.radio, selected === 'prefer_not' && styles.radioSelected]}>
          {selected === 'prefer_not' && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  backBtn: { marginTop: 12, marginBottom: 8, width: 40, height: 40, justifyContent: 'center' },
  title: { color: colors.text, fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 28 },
  cards: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  genderCard: {
    flex: 1, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: colors.card, alignItems: 'center', paddingTop: 20, paddingBottom: 16,
    minHeight: 280,
  },
  genderCardSelected: {
    borderColor: colors.accent, backgroundColor: colors.cardSelected,
  },
  genderLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  genderLabelSelected: { color: colors.text },
  bodyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  radio: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 2,
    borderColor: colors.textMuted, justifyContent: 'center', alignItems: 'center', marginTop: 12,
  },
  radioSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  preferCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: 'transparent', gap: 12,
  },
  preferCardSelected: { borderColor: colors.accent, backgroundColor: colors.cardSelected },
  preferText: { color: colors.textSecondary, fontSize: 15, flex: 1 },
  footer: { marginTop: 'auto', paddingTop: 16 },
  continueBtn: { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 17, alignItems: 'center' },
  continueBtnDisabled: { opacity: 0.4 },
  continueBtnText: { color: colors.text, fontSize: 15, fontWeight: '700', letterSpacing: 1.5 },
});
