import { ResultSetHeader } from "mysql2";
import { Session, SessionFilters } from "../types/sessions";
import { DB } from "../utils/db";

export const getSessions = async (userID: string, filters?: SessionFilters) => {
  let sql =
    "SELECT id, user_id, created_on, ended_on FROM sessions WHERE user_id = ?";
  let params: any[] = [userID];

  if (filters?.isActive === true) {
    sql += " AND ended_on IS NULL";
  } else if (filters?.isActive === false) {
    sql += " AND ended_on IS NOT NULL";
  }

  sql += " ORDER BY created_on DESC";

  if (filters?.limit) {
    sql += " LIMIT ?";
    params.push(filters.limit);
  }

  const [rows] = await DB.query<any[]>(sql, params);
  return rows as Session[];
};

export const getSession = async (sessionID: number, userID: string) => {
  const [rows] = await DB.query<any[]>(
    "SELECT id, user_id, created_on, ended_on FROM sessions WHERE id = ? AND user_id = ?",
    [sessionID, userID]
  );
  return rows.length ? (rows[0] as Session) : null;
};

export const createSession = async (userID: string) => {
  const [result] = await DB.execute<ResultSetHeader>(
    "INSERT INTO sessions (user_id) VALUES (?)",
    [userID]
  );
  return result.insertId;
};

export const endSession = async (sessionID: number) => {
  await DB.execute("UPDATE sessions SET ended_on = NOW() WHERE id = ?", [
    sessionID,
  ]);
};

export const deleteSession = async (sessionID: number) => {
  // Delete all workouts associated with the session
  await DB.execute("DELETE FROM workouts WHERE session_id = ?", [sessionID]);

  // Delete the session
  await DB.execute("DELETE FROM sessions WHERE id = ?", [sessionID]);
};
