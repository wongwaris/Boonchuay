import { UserProfile } from '../context/ProfileContext';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
}

export interface WorkoutDay {
  dayName: string;
  focus: string;
  emoji: string;
  exercises: Exercise[];
  estimatedMinutes: number;
  isRest?: boolean;
}

const DB: Record<string, { gym: Exercise[]; home: Exercise[] }> = {
  chest: {
    gym: [
      { name: 'Barbell Bench Press', sets: 4, reps: '6–10', rest: 90 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10–12', rest: 75 },
      { name: 'Cable Flyes', sets: 3, reps: '12–15', rest: 60 },
      { name: 'Chest Dips', sets: 3, reps: '10–15', rest: 60 },
    ],
    home: [
      { name: 'Push-ups', sets: 4, reps: '15–20', rest: 60 },
      { name: 'Wide Push-ups', sets: 3, reps: '15–20', rest: 60 },
      { name: 'Diamond Push-ups', sets: 3, reps: '10–15', rest: 60 },
      { name: 'Decline Push-ups', sets: 3, reps: '12–18', rest: 60 },
    ],
  },
  back: {
    gym: [
      { name: 'Barbell Deadlift', sets: 4, reps: '5–8', rest: 120 },
      { name: 'Lat Pulldown', sets: 3, reps: '10–12', rest: 75 },
      { name: 'Seated Cable Row', sets: 3, reps: '10–12', rest: 75 },
      { name: 'Dumbbell Row', sets: 3, reps: '10–12', rest: 60 },
    ],
    home: [
      { name: 'Pull-ups', sets: 4, reps: '6–10', rest: 90 },
      { name: 'Bodyweight Rows', sets: 3, reps: '12–15', rest: 75 },
      { name: 'Superman Hold', sets: 3, reps: '30 sec', rest: 45 },
    ],
  },
  legs: {
    gym: [
      { name: 'Barbell Squat', sets: 4, reps: '6–10', rest: 120 },
      { name: 'Romanian Deadlift', sets: 3, reps: '10–12', rest: 90 },
      { name: 'Leg Press', sets: 3, reps: '12–15', rest: 90 },
      { name: 'Leg Curl', sets: 3, reps: '12–15', rest: 60 },
      { name: 'Standing Calf Raise', sets: 4, reps: '15–20', rest: 45 },
    ],
    home: [
      { name: 'Bodyweight Squat', sets: 4, reps: '20–25', rest: 45 },
      { name: 'Reverse Lunges', sets: 3, reps: '15 each', rest: 45 },
      { name: 'Glute Bridge', sets: 3, reps: '20', rest: 40 },
      { name: 'Wall Sit', sets: 3, reps: '45 sec', rest: 60 },
      { name: 'Calf Raises', sets: 4, reps: '25', rest: 30 },
    ],
  },
  shoulders: {
    gym: [
      { name: 'Overhead Press', sets: 4, reps: '8–10', rest: 90 },
      { name: 'Lateral Raises', sets: 3, reps: '15–20', rest: 60 },
      { name: 'Front Raises', sets: 3, reps: '12–15', rest: 60 },
      { name: 'Rear Delt Flyes', sets: 3, reps: '15–20', rest: 60 },
    ],
    home: [
      { name: 'Pike Push-ups', sets: 4, reps: '12–15', rest: 60 },
      { name: 'Shoulder Taps', sets: 3, reps: '20 total', rest: 45 },
      { name: 'Y-T-W Raises', sets: 3, reps: '10 each', rest: 45 },
    ],
  },
  arms: {
    gym: [
      { name: 'Barbell Curl', sets: 3, reps: '10–12', rest: 60 },
      { name: 'Hammer Curl', sets: 3, reps: '10–12', rest: 60 },
      { name: 'Tricep Pushdown', sets: 3, reps: '12–15', rest: 60 },
      { name: 'Skull Crushers', sets: 3, reps: '10–12', rest: 60 },
    ],
    home: [
      { name: 'Tricep Dips (chair)', sets: 3, reps: '15–20', rest: 45 },
      { name: 'Close-grip Push-ups', sets: 3, reps: '12–18', rest: 45 },
      { name: 'Isometric Bicep Hold', sets: 3, reps: '30 sec', rest: 45 },
    ],
  },
  core: {
    gym: [
      { name: 'Cable Crunch', sets: 3, reps: '15–20', rest: 45 },
      { name: 'Hanging Leg Raise', sets: 3, reps: '12–15', rest: 45 },
      { name: 'Plank', sets: 3, reps: '45 sec', rest: 45 },
    ],
    home: [
      { name: 'Crunches', sets: 3, reps: '20', rest: 30 },
      { name: 'Plank', sets: 3, reps: '45 sec', rest: 45 },
      { name: 'Bicycle Crunches', sets: 3, reps: '20 total', rest: 30 },
      { name: 'Leg Raises', sets: 3, reps: '15', rest: 40 },
    ],
  },
  cardio: {
    gym: [
      { name: 'Treadmill Run', sets: 1, reps: '20 min', rest: 0 },
      { name: 'Stationary Bike', sets: 1, reps: '15 min', rest: 0 },
      { name: 'Burpees', sets: 4, reps: '15', rest: 60 },
    ],
    home: [
      { name: 'Jump Rope', sets: 1, reps: '15 min', rest: 0 },
      { name: 'Burpees', sets: 4, reps: '15', rest: 60 },
      { name: 'High Knees', sets: 4, reps: '30 sec', rest: 30 },
      { name: 'Mountain Climbers', sets: 4, reps: '30 sec', rest: 30 },
    ],
  },
};

const SPLITS: Record<number, Array<{ focus: string; emoji: string; muscles: string[] }>> = {
  3: [
    { focus: 'Chest & Triceps', emoji: '💪', muscles: ['chest', 'arms'] },
    { focus: 'Back & Biceps', emoji: '🏋️', muscles: ['back', 'arms'] },
    { focus: 'Legs & Shoulders', emoji: '🦵', muscles: ['legs', 'shoulders'] },
  ],
  4: [
    { focus: 'Chest & Shoulders', emoji: '💪', muscles: ['chest', 'shoulders'] },
    { focus: 'Back & Arms', emoji: '🏋️', muscles: ['back', 'arms'] },
    { focus: 'Legs & Core', emoji: '🦵', muscles: ['legs', 'core'] },
    { focus: 'Full Body Power', emoji: '⚡', muscles: ['chest', 'back', 'legs'] },
  ],
  5: [
    { focus: 'Chest', emoji: '💪', muscles: ['chest'] },
    { focus: 'Back', emoji: '🏋️', muscles: ['back'] },
    { focus: 'Legs', emoji: '🦵', muscles: ['legs'] },
    { focus: 'Shoulders & Arms', emoji: '💥', muscles: ['shoulders', 'arms'] },
    { focus: 'Full Body & Core', emoji: '🔥', muscles: ['core', 'cardio'] },
  ],
};

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function generateWorkoutPlan(profile: UserProfile): WorkoutDay[] {
  const days = profile.trainingDays ?? 3;
  const loc = profile.workoutLocation ?? 'gym';
  const splits = SPLITS[days] ?? SPLITS[3];

  const restDay: WorkoutDay = {
    dayName: '',
    focus: 'Rest & Recovery',
    emoji: '😴',
    exercises: [],
    estimatedMinutes: 0,
    isRest: true,
  };

  const trainingDays: WorkoutDay[] = splits.map((s) => {
    const exercises: Exercise[] = [];
    s.muscles.forEach((m) => {
      const pool = DB[m]?.[loc] ?? DB[m]?.gym ?? [];
      const pick = pool.slice(0, 3);
      exercises.push(...pick);
    });

    const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
    const estimatedMinutes = Math.round((totalSets * 2.5) / 60) * 60 / 60 + exercises.length * 2;

    return {
      dayName: '',
      focus: s.focus,
      emoji: s.emoji,
      exercises,
      estimatedMinutes: Math.max(30, Math.min(70, estimatedMinutes)),
    };
  });

  const plan: WorkoutDay[] = [];
  let trainingIdx = 0;

  for (let i = 0; i < 7; i++) {
    if (trainingIdx < trainingDays.length) {
      const step = Math.floor(7 / days);
      if (i % step === 0 && trainingIdx < days) {
        plan.push({ ...trainingDays[trainingIdx], dayName: WEEK_DAYS[i] });
        trainingIdx++;
      } else {
        plan.push({ ...restDay, dayName: WEEK_DAYS[i] });
      }
    } else {
      plan.push({ ...restDay, dayName: WEEK_DAYS[i] });
    }
  }

  return plan;
}
