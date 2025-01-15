export type ExerciseStats = StrengthExerciseStats | CardioExerciseStats;

export type StrengthExerciseStatItem = {
  weight: number;
  reps: number;
  sets: number;
  date: string;
};

export type StrengthExerciseStats = {
  best: StrengthExerciseStatItem | null;
  last: StrengthExerciseStatItem | null;
};

export type CardioExerciseStatItem = {
  distance: number;
  durationSeconds: number;
  incline: number;
  date: string;
};

export type CardioExerciseStats = {
  best: CardioExerciseStatItem | null;
  last: CardioExerciseStatItem | null;
};
