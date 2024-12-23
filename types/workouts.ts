import { Exercise } from "./exercises";

export type Workout = {
  id: number;
  weight: number;
  reps: number;
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
