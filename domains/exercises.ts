import { ResultSetHeader } from "mysql2";
import { Exercise, ExerciseCreate } from "../types/exercises";
import { DB } from "../utils/db";

const exerciseColumns = `id, user_id, name, exercise_type_id`;

export const getExercises = async (userID: string) => {
  const [rows] = await DB.query<any[]>(
    `SELECT ${exerciseColumns} FROM exercises WHERE user_id = ?`,
    [userID]
  );
  return rows as Exercise[];
};

export const getExercise = async (exerciseID: number, userID: string) => {
  const [rows] = await DB.query<any[]>(
    `SELECT ${exerciseColumns} FROM exercises WHERE id = ? AND user_id = ?`,
    [exerciseID, userID]
  );
  return rows.length ? (rows[0] as Exercise) : null;
};

export const createExercise = async (data: ExerciseCreate, userID: string) => {
  const [result] = await DB.execute<ResultSetHeader>(
    "INSERT INTO exercises (name, user_id, exercise_type_id) VALUES (?, ?, ?)",
    [data.name, userID, data.exercise_type_id]
  );
  return result.insertId;
};

export const deleteExercise = async (exerciseID: number) => {
  await DB.execute("DELETE FROM workouts WHERE exercise_id = ?", [exerciseID]);
  await DB.execute("DELETE FROM exercises WHERE id = ?", [exerciseID]);
};
