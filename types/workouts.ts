import { Exercise } from "./exercises";

export type Workout = {
  id: number;
  sessionID: number;
  weight: number;
  reps: number;
  sets: number;
  created_on: string;
  exercise: Exercise;
};

export type WorkoutCreate = {
  sessionID: number;
  exerciseID: number;
  reps: number;
  sets: number;
  weight: number;
};

export type WorkoutFilters = {
  sessionID?: number;
  exerciseID?: number;
};
