import { Session, SessionFilters } from "../types/sessions";
import { DB } from "../utils/db";

export const getSessions = async (userID: string, filters?: SessionFilters) => {
  let sql =
    "SELECT id, user_id, created_on, ended_on FROM sessions WHERE user_id = ?";

  console.log(filters);

  if (filters?.isActive === true) {
    sql += " AND ended_on IS NULL";
  } else if (filters?.isActive === false) {
    sql += " AND ended_on IS NOT NULL";
  }

  console.log(sql);

  const [rows] = await DB.query<any[]>(sql, [userID]);
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
  await DB.execute("INSERT INTO sessions (user_id) VALUES (?)", [userID]);
};

export const deleteSession = async (sessionID: number, userID: string) => {
  await DB.execute("DELETE FROM sessions WHERE id = ? AND user_id = ?", [
    sessionID,
    userID,
  ]);
};
