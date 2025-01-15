export type ExerciseStatItem = {
  weight: number | null;
  reps: number | null;
  sets: number | null;
  distance: number | null;
  durationSeconds: number | null;
  incline: number | null;
  date: string;
};

export type ExerciseStats = {
  best: ExerciseStatItem | null;
  last: ExerciseStatItem | null;
};
