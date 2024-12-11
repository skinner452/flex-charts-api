import { Machine, MachineCreate } from "../types/machines";
import { DB } from "../utils/db";

export const getMachines = async (userID: string) => {
  const [rows] = await DB.query<any[]>(
    "SELECT id, user_id, name FROM machines WHERE user_id = ?",
    [userID]
  );
  return rows as Machine[];
};

export const getMachine = async (userID: string, machineID: number) => {
  const [rows] = await DB.query<any[]>(
    "SELECT id, user_id, name FROM machines WHERE id = ? AND user_id = ?",
    [machineID, userID]
  );
  return rows.length ? (rows[0] as Machine) : null;
};

export const createMachine = async (userID: string, data: MachineCreate) => {
  await DB.execute("INSERT INTO machines (name, user_id) VALUES (?, ?)", [
    data.name,
    userID,
  ]);
};

export const deleteMachine = async (userID: string, machineID: number) => {
  await DB.execute("DELETE FROM machines WHERE id = ? AND user_id = ?", [
    machineID,
    userID,
  ]);
};
