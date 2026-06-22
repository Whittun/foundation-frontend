import type { DayRating } from '@/features/YearTracker/model/types';
import clsx from 'clsx';
import { Eraser } from 'lucide-react';
import s from './DayPopover.module.css';

type DayPopoverProps = {
  addRating: (ratingVariant: DayRating) => void;
  removeRating: () => void;
};

export const DayPopover = ({ addRating, removeRating }: DayPopoverProps) => {
  const ratingVariants: DayRating[] = [1, 2, 3, 4, 5];

  const noteHandler = () => {
    console.log('yes');
  };

  return (
    <div className={s.root}>
      <div className={s.rating}>
        {ratingVariants.map((ratingVariant) => {
          return (
            <div
              key={ratingVariant}
              onClick={() => addRating(ratingVariant)}
              className={clsx(s.ratingNumber, s['ratingNumber-' + ratingVariant])}
            >
              {ratingVariant}
            </div>
          );
        })}
        <button className={s.clearButton} onClick={removeRating}>
          <Eraser />
        </button>
      </div>

      <button onClick={noteHandler} className={s.noteButton}>
        Add note
      </button>
    </div>
  );
};
