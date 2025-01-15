import {
  CardioExerciseStatItem,
  CardioExerciseStats,
  StrengthExerciseStatItem,
  StrengthExerciseStats,
} from "../types/exercise_stats";
import { ExerciseTypeID } from "../types/exercise_types";
import { DB } from "../utils/db";

const strengthExerciseColumns = `weight, reps, sets, created_on`;

const castToStrengthExerciseStatItem = (row: any) => {
  return {
    weight: row.weight,
    reps: row.reps,
    sets: row.sets,
    date: row.created_on,
  } as StrengthExerciseStatItem;
};

const cardioExerciseColumns = `distance, duration_seconds, incline, created_on`;

const castToCardioExerciseStatItem = (row: any) => {
  return {
    distance: row.distance,
    durationSeconds: row.duration_seconds,
    incline: row.incline,
    date: row.created_on,
  } as CardioExerciseStatItem;
};

const getStrengthExerciseStats = async (exerciseID: number) => {
  const [bestRows] = await DB.query<any[]>(
    `SELECT ${strengthExerciseColumns}
    FROM workouts
    WHERE exercise_id = ?
    ORDER BY weight DESC
    LIMIT 1`,
    [exerciseID]
  );

  const [lastRows] = await DB.query<any[]>(
    `SELECT ${strengthExerciseColumns}
    FROM workouts
    WHERE workouts.exercise_id = ?
    ORDER BY created_on DESC
    LIMIT 1`,
    [exerciseID]
  );

  return {
    best: bestRows.length ? castToStrengthExerciseStatItem(bestRows[0]) : null,
    last: lastRows.length ? castToStrengthExerciseStatItem(lastRows[0]) : null,
  } as StrengthExerciseStats;
};

const getCardioExerciseStats = async (exerciseID: number) => {
  const [bestRows] = await DB.query<any[]>(
    `SELECT ${cardioExerciseColumns}
    FROM workouts
    WHERE exercise_id = ?
    ORDER BY distance DESC
    LIMIT 1`,
    [exerciseID]
  );

  const [lastRows] = await DB.query<any[]>(
    `SELECT ${cardioExerciseColumns}
    FROM workouts
    WHERE workouts.exercise_id = ?
    ORDER BY created_on DESC
    LIMIT 1`,
    [exerciseID]
  );

  return {
    best: bestRows.length ? castToCardioExerciseStatItem(bestRows[0]) : null,
    last: lastRows.length ? castToCardioExerciseStatItem(lastRows[0]) : null,
  } as CardioExerciseStats;
};

export const getExerciseStats = async (
  exerciseID: number,
  exerciseTypeID: ExerciseTypeID
) => {
  if (exerciseTypeID === ExerciseTypeID.STRENGTH) {
    return getStrengthExerciseStats(exerciseID);
  }

  if (exerciseTypeID === ExerciseTypeID.CARDIO) {
    return getCardioExerciseStats(exerciseID);
  }

  return null;
};
