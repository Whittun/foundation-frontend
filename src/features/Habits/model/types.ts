export type Habit = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type HabitLevel = {
  id: number;
  habit: Habit;
  description: string;
  progress: number;
  target: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateHabitLevelArgs = {
  habitLevelId: number;
  level?: number;
  description?: string;
  target?: number;
  progress?: number;
};

export type CreateHabitLevelArgs = {
  habitId: number;
  level: number;
  description: string;
  target: number;
};

export type DraftInputsValues = {
  levelValue: undefined | number;
  descriptionValue: string;
  targetValue: undefined | number;
};
