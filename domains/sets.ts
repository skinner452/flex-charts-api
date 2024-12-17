import { ResultSetHeader } from "mysql2";
import { SetCreate, SetType } from "../types/sets";
import { DB } from "../utils/db";

export const getSets = async (userID: string) => {
  const [rows] = await DB.query<any[]>(
    `SELECT
      sets.id,
      sets.weight,
      sets.reps,
      sets.datetime,
      machines.id AS machine_id,
      machines.user_id AS machine_user_id,
      machines.name AS machine_name
    FROM sets
    JOIN machines ON sets.machine_id = machines.id
    WHERE machines.user_id = ?`,
    [userID]
  );

  const castedRows = rows.map((row) => {
    return {
      id: row.id,
      weight: row.weight,
      reps: row.reps,
      datetime: row.datetime,
      machine: {
        id: row.machine_id,
        user_id: row.machine_user_id,
        name: row.machine_name,
      },
    } as SetType;
  });

  return castedRows;
};

export const getSet = async (setID: number, userID: string) => {
  const [rows] = await DB.query<any[]>(
    `SELECT
      sets.id,
      sets.weight,
      sets.reps,
      sets.datetime,
      machines.id AS machine_id,
      machines.user_id AS machine_user_id,
      machines.name AS machine_name
    FROM sets
    JOIN machines ON sets.machine_id = machines.id
    WHERE sets.id = ? AND machines.user_id = ?`,
    [setID, userID]
  );

  return rows.length ? (rows[0] as SetType) : null;
};

export const createSet = async (userID: string, data: SetCreate) => {
  const [result] = await DB.execute<ResultSetHeader>(
    "INSERT INTO sets (machine_id, weight, reps, datetime) VALUES (?, ?, ?, ?)",
    [data.machineID, data.weight, data.reps, data.datetime]
  );
  return result.insertId;
};
