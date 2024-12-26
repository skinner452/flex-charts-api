export type Session = {
  id: number;
  user_id: string;
  created_on: string;
  ended_on: string | null;
};

export type SessionFilters = {
  isActive?: boolean;
  limit?: number;
};
