import { Exercise } from "./exercises";

export type Workout = {
  id: number;
  sessionID: number;
  created_on: string;
  exercise: Exercise;
  weight: number | null;
  reps: number | null;
  sets: number | null;
  distance: number | null;
  durationSeconds: number | null;
  incline: number | null;
};

export type WorkoutCreate = {
  sessionID: number;
  exerciseID: number;
  reps: number | null;
  sets: number | null;
  weight: number | null;
  distance: number | null;
  durationSeconds: number | null;
  incline: number | null;
};

export type WorkoutFilters = {
  sessionID?: number;
  exerciseID?: number;
  sort?: string;
};
