import { ChartNoAxesColumnIncreasing } from 'lucide-react';
import s from './emptyHabits.module.css';
import { useOutletContext } from 'react-router-dom';

type HabitsOutletContext = {
  handleOpenForm: () => void;
};

export const EmptyHabits = () => {
  const { handleOpenForm } = useOutletContext<HabitsOutletContext>();

  return (
    <div className={s.root}>
      <div className={s.emptyMessageWrapper}>
        <ChartNoAxesColumnIncreasing className={s.icon} />
        <p>Create your first Habit</p>
        <button onClick={handleOpenForm} className={s.createButton}>
          Create
        </button>
      </div>
    </div>
  );
};
