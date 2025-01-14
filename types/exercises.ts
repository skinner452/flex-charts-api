export type Exercise = {
  id: number;
  user_id: string;
  name: string;
};

export type ExerciseCreate = {
  name: string;
  exercise_type_id: number;
};

export type ExerciseStatItem = {
  weight: number;
  reps: number;
  sets: number;
  date: string;
};

export type ExerciseStats = {
  best: ExerciseStatItem | null;
  last: ExerciseStatItem | null;
};
