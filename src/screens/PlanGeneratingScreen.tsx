import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'PlanGenerating'>;

const STEPS = [
  'Analyzing your body metrics…',
  'Calibrating fitness level…',
  'Selecting target muscle groups…',
  'Building your weekly schedule…',
  'Optimizing exercise selection…',
  'Calculating rest periods…',
  'Personalizing nutrition tips…',
  'Your plan is ready! 🎉',
];

export default function PlanGeneratingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { update } = useProfile();

  const progress = useRef(new Animated.Value(0)).current;
  const stepOpacity = useRef(new Animated.Value(1)).current;
  const stepIndex = useRef(0);
  const stepText = useRef(new Animated.Value(0)).current;
  const [currentStep, setCurrentStep] = React.useState(STEPS[0]);

  useEffect(() => {
    const totalDuration = 3200;

    Animated.timing(progress, {
      toValue: 1,
      duration: totalDuration,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      stepIndex.current = Math.min(stepIndex.current + 1, STEPS.length - 1);
      Animated.sequence([
        Animated.timing(stepOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start(() => {
        setCurrentStep(STEPS[stepIndex.current]);
        Animated.timing(stepOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      });
    }, totalDuration / STEPS.length);

    const timer = setTimeout(() => {
      clearInterval(interval);
      update({ onboardingComplete: true });
      navigation.replace('Home');
    }, totalDuration + 600);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient
      colors={['#050A14', '#0B1420', '#0A1535']}
      style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}
    >
      {/* Logo */}
      <View style={styles.logoRow}>
        <Text style={styles.logoFit}>FIT</Text>
        <Text style={styles.logoEasy}>EASY</Text>
      </View>

      <Text style={styles.headline}>Building your{'\n'}personalized plan</Text>

      {/* Animated progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: widthInterpolation }]}
          />
        </View>
        <Animated.Text style={[styles.stepText, { opacity: stepOpacity }]}>
          {currentStep}
        </Animated.Text>
      </View>

      {/* Feature pills */}
      <View style={styles.pills}>
        {['Anatomy-based', 'Science-backed', 'Personalized'].map((tag) => (
          <View key={tag} style={styles.pill}>
            <Text style={styles.pillText}>{tag}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 36 },
  logoRow: { flexDirection: 'row' },
  logoFit: { fontSize: 42, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  logoEasy: { fontSize: 42, fontWeight: '900', color: colors.accent, letterSpacing: -1 },
  headline: {
    color: colors.text, fontSize: 28, fontWeight: '700',
    textAlign: 'center', lineHeight: 38,
  },
  progressSection: { width: '80%', alignItems: 'center', gap: 16 },
  progressTrack: {
    width: '100%', height: 6, backgroundColor: colors.border,
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: colors.accent, borderRadius: 3,
  },
  stepText: { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  pills: { flexDirection: 'row', gap: 10 },
  pill: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.borderSelected,
    backgroundColor: 'rgba(74,124,247,0.1)',
  },
  pillText: { color: colors.accent, fontSize: 12, fontWeight: '600' },
});
