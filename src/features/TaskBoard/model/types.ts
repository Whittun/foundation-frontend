type Schedule =
  | {
      type: 'daily';
      every: number;
    }
  | {
      type: 'weekly';
      every: number;
      days: number[];
    }
  | {
      type: 'monthly';
      every: number;
    };

export type Task = {
  id: number;
  title: string;
  description: string;
  completedDate: string | null;
  startDate: string;
  schedule: Schedule;
};

export type EditTask = {
  title?: string;
  description?: string;
  startDate?: string;
  schedule?: Schedule;
  completedDate?: string | null;
};

export type CreateTask = {
  title: string;
  description?: string;
  startDate: string;
  schedule: Schedule;
};
