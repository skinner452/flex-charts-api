import { ResultSetHeader } from "mysql2";
import { Machine, MachineCreate } from "../types/machines";
import { DB } from "../utils/db";

export const getMachines = async (userID: string) => {
  const [rows] = await DB.query<any[]>(
    "SELECT id, user_id, name FROM machines WHERE user_id = ?",
    [userID]
  );
  return rows as Machine[];
};

export const getMachine = async (machineID: number, userID: string) => {
  const [rows] = await DB.query<any[]>(
    "SELECT id, user_id, name FROM machines WHERE id = ? AND user_id = ?",
    [machineID, userID]
  );
  return rows.length ? (rows[0] as Machine) : null;
};

export const createMachine = async (data: MachineCreate, userID: string) => {
  const [result] = await DB.execute<ResultSetHeader>(
    "INSERT INTO machines (name, user_id) VALUES (?, ?)",
    [data.name, userID]
  );
  return result.insertId;
};

export const deleteMachine = async (machineID: number, userID: string) => {
  await DB.execute("DELETE FROM machines WHERE id = ? AND user_id = ?", [
    machineID,
    userID,
  ]);
};
