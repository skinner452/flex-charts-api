import { ResultSetHeader } from "mysql2";
import { WorkoutCreate, Workout } from "../types/workouts";
import { DB } from "../utils/db";

const workoutColumns = `
  workouts.id,
  workouts.weight,
  workouts.reps,
  workouts.created_on,
  exercises.id AS exercise_id,
  exercises.user_id AS exercise_user_id,
  exercises.name AS exercise_name
`;

export const getWorkouts = async (userID: string) => {
  const [rows] = await DB.query<any[]>(
    `SELECT ${workoutColumns}
    FROM workouts
    JOIN exercises ON workouts.exercise_id = exercises.id
    WHERE exercises.user_id = ?`,
    [userID]
  );

  const castedRows = rows.map((row) => {
    return {
      id: row.id,
      weight: row.weight,
      reps: row.reps,
      created_on: row.created_on,
      exercise: {
        id: row.exercise_id,
        user_id: row.exercise_user_id,
        name: row.exercise_name,
      },
    } as Workout;
  });

  return castedRows;
};

export const getWorkout = async (workoutID: number, userID: string) => {
  const [rows] = await DB.query<any[]>(
    `SELECT ${workoutColumns}
    FROM workouts
    JOIN exercises ON workouts.exercise_id = exercises.id
    WHERE workouts.id = ? AND exercises.user_id = ?`,
    [workoutID, userID]
  );

  return rows.length ? (rows[0] as Workout) : null;
};

export const createWorkout = async (userID: string, data: WorkoutCreate) => {
  const [result] = await DB.execute<ResultSetHeader>(
    "INSERT INTO workouts (exercise_id, weight, reps, sets) VALUES (?, ?, ?, ?)",
    [data.exerciseID, data.weight, data.reps, data.sets]
  );
  return result.insertId;
};
