import { Machine } from "./machines";

// Set is reserved, so we use SetType instead
export type SetType = {
  id: number;
  weight: number;
  reps: number;
  datetime: Date;
  machine: Machine;
};

export type SetCreate = {
  machineID: number;
  reps: number;
  weight: number;
  datetime: Date;
};
