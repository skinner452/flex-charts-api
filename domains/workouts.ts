import { ResultSetHeader } from "mysql2";
import { WorkoutCreate, Workout, WorkoutFilters } from "../types/workouts";
import { DB } from "../utils/db";

const workoutColumns = `
  workouts.id,
  workouts.session_id,
  workouts.weight,
  workouts.reps,
  workouts.sets,
  workouts.distance,
  workouts.duration_seconds,
  workouts.incline,
  workouts.created_on,
  exercises.id AS exercise_id,
  exercises.user_id AS exercise_user_id,
  exercises.name AS exercise_name,
  exercises.exercise_type_id
`;

const castWorkout = (row: any) => {
  return {
    id: row.id,
    sessionID: row.session_id,
    weight: row.weight,
    reps: row.reps,
    sets: row.sets,
    distance: row.distance,
    durationSeconds: row.duration_seconds,
    incline: row.incline,
    created_on: row.created_on,
    exercise: {
      id: row.exercise_id,
      user_id: row.exercise_user_id,
      name: row.exercise_name,
      exercise_type_id: row.exercise_type_id,
    },
  } as Workout;
};

export const getWorkouts = async (userID: string, filters?: WorkoutFilters) => {
  let sql = `
    SELECT ${workoutColumns}
    FROM workouts
    JOIN exercises ON workouts.exercise_id = exercises.id
    WHERE exercises.user_id = ?
  `;
  const values = [userID];

  if (filters?.sessionID) {
    sql += " AND workouts.session_id = ?";
    values.push(filters.sessionID.toString());
  }

  if (filters?.exerciseID) {
    sql += " AND workouts.exercise_id = ?";
    values.push(filters.exerciseID.toString());
  }

  if (filters?.sort) {
    const dir = filters.sort.startsWith("-") ? "DESC" : "ASC";
    const column = filters.sort.replace(/^-/, "");

    // Add allowed sorting columns as needed
    if (["created_on"].includes(column)) {
      sql += ` ORDER BY ${column} ${dir}`;
    }
  } else {
    sql += " ORDER BY workouts.created_on DESC";
  }

  const [rows] = await DB.query<any[]>(sql, values);
  return rows.map((row) => castWorkout(row));
};

export const getWorkout = async (workoutID: number, userID: string) => {
  const [rows] = await DB.query<any[]>(
    `SELECT ${workoutColumns}
    FROM workouts
    JOIN exercises ON workouts.exercise_id = exercises.id
    WHERE workouts.id = ? AND exercises.user_id = ?`,
    [workoutID, userID]
  );

  if (rows.length === 0) return null;
  return castWorkout(rows[0]);
};

export const createWorkout = async (data: WorkoutCreate) => {
  const [result] = await DB.execute<ResultSetHeader>(
    `INSERT INTO workouts
    (session_id, exercise_id, weight, reps, sets, distance, duration_seconds, incline)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.sessionID,
      data.exerciseID,
      data.weight,
      data.reps,
      data.sets,
      data.distance,
      data.durationSeconds,
      data.incline,
    ]
  );
  return result.insertId;
};

export const deleteWorkout = async (workoutID: number, userID: string) => {
  await DB.execute(
    "DELETE FROM workouts WHERE id = ? AND exercise_id IN (SELECT id FROM exercises WHERE user_id = ?)",
    [workoutID, userID]
  );
};
