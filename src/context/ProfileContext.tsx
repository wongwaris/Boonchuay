import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  gender: 'male' | 'female' | 'prefer_not' | null;
  goal: 'lose_weight' | 'gain_muscle' | 'increase_strength' | null;
  fitnessLevel: 'beginner' | 'intermediate' | 'regular' | 'athlete' | null;
  targetZones: string[];
  injuries: string[];
  workoutDuration: string | null;
  heightValue: number;
  heightUnit: 'cm' | 'ft';
  currentWeightValue: number;
  currentWeightUnit: 'kg' | 'lbs';
  targetWeightValue: number;
  targetWeightUnit: 'kg' | 'lbs';
  waterIntake: string | null;
  hydrationReminder: string | null;
  dietStyle: string | null;
  trainingDays: number | null;
  trainingTime: string | null;
  workoutLocation: 'home' | 'gym' | null;
  equipment: string[];
  onboardingComplete: boolean;
}

const defaultProfile: UserProfile = {
  gender: null,
  goal: null,
  fitnessLevel: null,
  targetZones: [],
  injuries: [],
  workoutDuration: null,
  heightValue: 170,
  heightUnit: 'cm',
  currentWeightValue: 70,
  currentWeightUnit: 'kg',
  targetWeightValue: 70,
  targetWeightUnit: 'kg',
  waterIntake: null,
  hydrationReminder: null,
  dietStyle: null,
  trainingDays: null,
  trainingTime: null,
  workoutLocation: null,
  equipment: [],
  onboardingComplete: false,
};

type Action =
  | { type: 'UPDATE'; payload: Partial<UserProfile> }
  | { type: 'LOAD'; payload: UserProfile };

function reducer(state: UserProfile, action: Action): UserProfile {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, ...action.payload };
    case 'LOAD':
      return action.payload;
    default:
      return state;
  }
}

interface ProfileContextType {
  profile: UserProfile;
  update: (data: Partial<UserProfile>) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  update: () => {},
});

const STORAGE_KEY = '@fiteasy_profile';

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, dispatch] = useReducer(reducer, defaultProfile);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          dispatch({ type: 'LOAD', payload: JSON.parse(raw) });
        } catch {}
      }
    });
  }, []);

  const update = (data: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE', payload: data });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profile, ...data }));
  };

  return (
    <ProfileContext.Provider value={{ profile, update }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
