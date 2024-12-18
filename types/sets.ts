import { Machine } from "./machines";

// Set is reserved, so we use SetType instead
export type SetType = {
  id: number;
  weight: number;
  reps: number;
  datetime: string;
  machine: Machine;
};

export type SetCreate = {
  sessionID: number;
  machineID: number;
  reps: number;
  weight: number;
  datetime: string;
};
