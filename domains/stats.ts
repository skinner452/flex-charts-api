import { WeeklyStats, WeeklyTotals } from "../types/stats";
import { DB } from "../utils/db";

const getWeeklyTotals = async (userID: string, weekStart: Date) => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const workoutQuery = `
    SELECT SUM(workouts.weight * workouts.reps * workouts.sets) as weight, SUM(workouts.distance) as distance
    FROM workouts
    JOIN sessions ON sessions.id = workouts.session_id
    WHERE sessions.user_id = ?
    AND workouts.created_on >= ?
    AND workouts.created_on < ?
  `;

  const sessionQuery = `
    SELECT COUNT(*) as sessions
    FROM sessions
    WHERE user_id = ?
    AND created_on >= ?
    AND created_on < ?
  `;

  const [[[workoutRow]], [[sessionRow]]] = await Promise.all([
    DB.query<any[]>(workoutQuery, [userID, weekStart, weekEnd]),
    DB.query<any[]>(sessionQuery, [userID, weekStart, weekEnd]),
  ]);

  return {
    weight: Number(workoutRow.weight), // Number casting is necessary because the sum is returned as a string due to big numbers
    distance: Number(workoutRow.distance),
    sessions: Number(sessionRow.sessions),
  } as WeeklyTotals;
};

const getDiffPct = (thisWeek: number, prevWeek: number) =>
  prevWeek ? (thisWeek - prevWeek) / prevWeek : 0;

export const getWeeklyStats = async (userID: string, weekStart: Date) => {
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(weekStart.getDate() - 7);

  const [thisWeek, prevWeek] = await Promise.all([
    getWeeklyTotals(userID, weekStart),
    getWeeklyTotals(userID, prevWeekStart),
  ]);

  return {
    weight: thisWeek.weight,
    weightChange: thisWeek.weight - prevWeek.weight,
    weightChangePct: getDiffPct(thisWeek.weight, prevWeek.weight),
    distance: thisWeek.distance,
    distanceChange: thisWeek.distance - prevWeek.distance,
    distanceChangePct: getDiffPct(thisWeek.distance, prevWeek.distance),
    sessions: thisWeek.sessions,
    sessionsChange: thisWeek.sessions - prevWeek.sessions,
    sessionsChangePct: getDiffPct(thisWeek.sessions, prevWeek.sessions),
  } as WeeklyStats;
};
