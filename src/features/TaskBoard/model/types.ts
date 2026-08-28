export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  startDate: string;
  schedule:
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
      };
};
