export type WeeklyStatsParams = {
  weekStart: string; // ISO8601 date string
};

export type WeeklyTotals = {
  weight: number;
  distance: number;
  sessions: number;
};

export type WeeklyStats = {
  weight: number;
  weightChange: number;
  weightChangePct: number;
  distance: number;
  distanceChange: number;
  distanceChangePct: number;
  sessions: number;
  sessionsChange: number;
  sessionsChangePct: number;
};
