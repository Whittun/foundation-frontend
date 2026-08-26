import type { Task } from './types';

export const isTaskScheduledForDate = (task: Task, date: string): boolean => {
  if (task.schedule.type !== 'daily') {
    return false;
  }

  if (date < task.startDate) {
    return false;
  }

  const start = new Date(task.startDate);
  const target = new Date(date);

  const differenceInMs = target.getTime() - start.getTime();

  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

  return differenceInDays % task.schedule.every === 0;
};
