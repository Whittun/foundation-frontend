import type { Task } from './types';

const getWeekStart = (date: Date) => {
  const day = date.getUTCDay();
  const daysFromMonday = (day + 6) % 7;

  const weekStart = new Date(date);

  weekStart.setUTCDate(weekStart.getUTCDate() - daysFromMonday);

  return weekStart;
};

export const isTaskScheduledForDate = (task: Task, targetDate: string): boolean => {
  if (targetDate < task.startDate) {
    return false;
  }

  if (task.schedule.type === 'daily') {
    const start = new Date(task.startDate);
    const target = new Date(targetDate);

    const differenceInMs = target.getTime() - start.getTime();
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    return differenceInDays % task.schedule.every === 0;
  }

  if (task.schedule.type === 'weekly') {
    const target = new Date(targetDate);
    const weekday = target.getUTCDay();

    if (!task.schedule.days.includes(weekday)) {
      return false;
    }

    const start = new Date(task.startDate);

    const startWeek = getWeekStart(start);
    const targetWeek = getWeekStart(target);

    const differenceInMs = targetWeek.getTime() - startWeek.getTime();

    const differenceInWeeks = differenceInMs / (1000 * 60 * 60 * 24 * 7);

    return differenceInWeeks % task.schedule.every === 0;
  }

  return false;
};
