import { ResultSetHeader } from "mysql2";
import { WorkoutCreate, Workout, WorkoutFilters } from "../types/workouts";
import { DB } from "../utils/db";

const workoutColumns = `
  workouts.id,
  workouts.session_id,
  workouts.weight,
  workouts.reps,
  workouts.sets,
  workouts.created_on,
  exercises.id AS exercise_id,
  exercises.user_id AS exercise_user_id,
  exercises.name AS exercise_name
`;

export const getWorkouts = async (userID: string, filters?: WorkoutFilters) => {
  let sql = `
    SELECT ${workoutColumns}
    FROM workouts
    JOIN exercises ON workouts.exercise_id = exercises.id
    WHERE exercises.user_id = ?
  `;
  let values = [userID];

  if (filters?.sessionID) {
    sql += " AND workouts.session_id = ?";
    values.push(filters.sessionID.toString());
  }

  const [rows] = await DB.query<any[]>(sql, values);

  const castedRows = rows.map((row) => {
    return {
      id: row.id,
      sessionID: row.session_id,
      weight: row.weight,
      reps: row.reps,
      sets: row.sets,
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
    "INSERT INTO workouts (session_id, exercise_id, weight, reps, sets) VALUES (?, ?, ?, ?, ?)",
    [data.sessionID, data.exerciseID, data.weight, data.reps, data.sets]
  );
  return result.insertId;
};
