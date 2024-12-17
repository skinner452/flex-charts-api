export type Session = {
  id: number;
  user_id: string;
  created_on: Date;
  ended_on: Date | null;
};

export type SessionFilters = {
  isActive?: boolean;
};
