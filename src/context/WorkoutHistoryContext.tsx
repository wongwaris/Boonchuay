import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SetLog {
  reps: number;
  weight: number;
}

export interface ExerciseLog {
  name: string;
  sets: SetLog[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  focus: string;
  emoji: string;
  durationSeconds: number;
  exercises: ExerciseLog[];
  totalVolume: number;
}

export interface WeightLog {
  date: string;
  weightKg: number;
}

interface HistoryState {
  workouts: WorkoutLog[];
  weights: WeightLog[];
}

const defaultState: HistoryState = { workouts: [], weights: [] };

type Action =
  | { type: 'ADD_WORKOUT'; payload: WorkoutLog }
  | { type: 'ADD_WEIGHT'; payload: WeightLog }
  | { type: 'LOAD'; payload: HistoryState };

function reducer(state: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case 'ADD_WORKOUT':
      return { ...state, workouts: [action.payload, ...state.workouts] };
    case 'ADD_WEIGHT':
      return { ...state, weights: [action.payload, ...state.weights] };
    case 'LOAD':
      return action.payload;
    default:
      return state;
  }
}

interface HistoryContextType {
  workouts: WorkoutLog[];
  weights: WeightLog[];
  streak: number;
  addWorkout: (log: WorkoutLog) => void;
  addWeight: (log: WeightLog) => void;
}

const HistoryContext = createContext<HistoryContextType>({
  workouts: [],
  weights: [],
  streak: 0,
  addWorkout: () => {},
  addWeight: () => {},
});

const STORAGE_KEY = '@fiteasy_history';

function calcStreak(workouts: WorkoutLog[]): number {
  if (workouts.length === 0) return 0;
  const dates = [...new Set(workouts.map((w) => w.date))].sort((a, b) => b.localeCompare(a));
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 0;
  let expected = dates[0] === today ? today : yesterday;
  for (const date of dates) {
    if (date === expected) {
      streak++;
      const d = new Date(expected);
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().slice(0, 10);
    } else {
      break;
    }
  }
  return streak;
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          dispatch({ type: 'LOAD', payload: JSON.parse(raw) });
        } catch {}
      }
    });
  }, []);

  const streak = useMemo(() => calcStreak(state.workouts), [state.workouts]);

  const addWorkout = (log: WorkoutLog) => {
    const next: HistoryState = { ...state, workouts: [log, ...state.workouts] };
    dispatch({ type: 'ADD_WORKOUT', payload: log });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addWeight = (log: WeightLog) => {
    const next: HistoryState = { ...state, weights: [log, ...state.weights] };
    dispatch({ type: 'ADD_WEIGHT', payload: log });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <HistoryContext.Provider value={{
      workouts: state.workouts,
      weights: state.weights,
      streak,
      addWorkout,
      addWeight,
    }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}
