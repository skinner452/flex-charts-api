import { ExerciseTypeID } from "./exercise_types";

export type Exercise = {
  id: number;
  user_id: string;
  name: string;
  exercise_type_id: ExerciseTypeID;
};

export type ExerciseCreate = {
  name: string;
  exercise_type_id: ExerciseTypeID;
};

export type ExerciseUpdate = {
  name: string;
};
