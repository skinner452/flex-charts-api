import { ExerciseStatItem, ExerciseStats } from "../types/exercise_stats";
import { ExerciseTypeID } from "../types/exercise_types";
import { DB } from "../utils/db";

const exerciseStatsColumns = `weight, reps, sets, distance, duration_seconds, incline, created_on`;

const strengthOrderBy = `weight DESC, reps DESC`;
const cardioOrderBy = `distance DESC`;

const castToExerciseStatItem = (row: any) => {
  return {
    weight: row.weight,
    reps: row.reps,
    sets: row.sets,
    distance: row.distance,
    durationSeconds: row.duration_seconds,
    incline: row.incline,
    date: row.created_on,
  } as ExerciseStatItem;
};

export const getExerciseStats = async (
  exerciseID: number,
  exerciseTypeID: ExerciseTypeID
) => {
  let orderBy: string;
  if (exerciseTypeID === ExerciseTypeID.STRENGTH) {
    orderBy = strengthOrderBy;
  } else if (exerciseTypeID === ExerciseTypeID.CARDIO) {
    orderBy = cardioOrderBy;
  } else {
    // Unhandled type
    orderBy = "id DESC";
  }

  const [bestRows] = await DB.query<any[]>(
    `SELECT ${exerciseStatsColumns}
    FROM workouts
    WHERE workouts.exercise_id = ?
    ORDER BY ${orderBy}
    LIMIT 1`,
    [exerciseID]
  );

  const [lastRows] = await DB.query<any[]>(
    `SELECT ${exerciseStatsColumns}
    FROM workouts
    WHERE workouts.exercise_id = ?
    ORDER BY created_on DESC
    LIMIT 1`,
    [exerciseID]
  );

  return {
    best: bestRows.length ? castToExerciseStatItem(bestRows[0]) : null,
    last: lastRows.length ? castToExerciseStatItem(lastRows[0]) : null,
  } as ExerciseStats;
};
