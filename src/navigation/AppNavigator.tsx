import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useProfile } from '../context/ProfileContext';

import SplashScreen from '../screens/SplashScreen';
import GenderScreen from '../screens/GenderScreen';
import GoalScreen from '../screens/GoalScreen';
import FitnessLevelScreen from '../screens/FitnessLevelScreen';
import TargetZonesScreen from '../screens/TargetZonesScreen';
import InjuriesScreen from '../screens/InjuriesScreen';
import WorkoutDurationScreen from '../screens/WorkoutDurationScreen';
import ScienceFactScreen from '../screens/ScienceFactScreen';
import HeightScreen from '../screens/HeightScreen';
import CurrentWeightScreen from '../screens/CurrentWeightScreen';
import TargetWeightScreen from '../screens/TargetWeightScreen';
import WaterIntakeScreen from '../screens/WaterIntakeScreen';
import HydrationReminderScreen from '../screens/HydrationReminderScreen';
import DietStyleScreen from '../screens/DietStyleScreen';
import TrainingDaysScreen from '../screens/TrainingDaysScreen';
import TrainingTimeScreen from '../screens/TrainingTimeScreen';
import WorkoutLocationScreen from '../screens/WorkoutLocationScreen';
import EquipmentScreen from '../screens/EquipmentScreen';
import PlanGeneratingScreen from '../screens/PlanGeneratingScreen';
import HomeScreen from '../screens/HomeScreen';

export type RootStackParamList = {
  Splash: undefined;
  Gender: undefined;
  Goal: undefined;
  FitnessLevel: undefined;
  TargetZones: undefined;
  Injuries: undefined;
  WorkoutDuration: undefined;
  ScienceFact: undefined;
  Height: undefined;
  CurrentWeight: undefined;
  TargetWeight: undefined;
  WaterIntake: undefined;
  HydrationReminder: undefined;
  DietStyle: undefined;
  TrainingDays: undefined;
  TrainingTime: undefined;
  WorkoutLocation: undefined;
  Equipment: undefined;
  PlanGenerating: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { profile } = useProfile();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName={profile.onboardingComplete ? 'Home' : 'Splash'}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Gender" component={GenderScreen} />
      <Stack.Screen name="Goal" component={GoalScreen} />
      <Stack.Screen name="FitnessLevel" component={FitnessLevelScreen} />
      <Stack.Screen name="TargetZones" component={TargetZonesScreen} />
      <Stack.Screen name="Injuries" component={InjuriesScreen} />
      <Stack.Screen name="WorkoutDuration" component={WorkoutDurationScreen} />
      <Stack.Screen name="ScienceFact" component={ScienceFactScreen} />
      <Stack.Screen name="Height" component={HeightScreen} />
      <Stack.Screen name="CurrentWeight" component={CurrentWeightScreen} />
      <Stack.Screen name="TargetWeight" component={TargetWeightScreen} />
      <Stack.Screen name="WaterIntake" component={WaterIntakeScreen} />
      <Stack.Screen name="HydrationReminder" component={HydrationReminderScreen} />
      <Stack.Screen name="DietStyle" component={DietStyleScreen} />
      <Stack.Screen name="TrainingDays" component={TrainingDaysScreen} />
      <Stack.Screen name="TrainingTime" component={TrainingTimeScreen} />
      <Stack.Screen name="WorkoutLocation" component={WorkoutLocationScreen} />
      <Stack.Screen name="Equipment" component={EquipmentScreen} />
      <Stack.Screen name="PlanGenerating" component={PlanGeneratingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
