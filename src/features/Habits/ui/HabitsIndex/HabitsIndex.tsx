import { Navigate } from 'react-router-dom';
import { EmptyHabits } from '../EmptyHabits/EmptyHabits';
import { useGetAllHabitsQuery } from '@/features/Habits/api/habitsApi';

export const HabitsIndex = () => {
  const { data, isSuccess } = useGetAllHabitsQuery();

  const habitId = localStorage.getItem('lastOpenedHabitId');

  const numericHabitId = Number(habitId);
  const isValidHabitId = Number.isInteger(numericHabitId) && habitId !== null && numericHabitId > 0;

  if (isValidHabitId) {
    return <Navigate to={`/habits/${habitId}`} replace />;
  }

  if (isSuccess && data && data.length > 0) {
    return <Navigate to={`/habits/${data[0].id}`} replace />;
  }

  return <EmptyHabits />;
};
