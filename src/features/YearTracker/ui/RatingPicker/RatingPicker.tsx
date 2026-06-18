import clsx from 'clsx';
import { Eraser } from 'lucide-react';
import type { DayRating } from '@/features/YearTracker/model/types';
import s from './RatingPicker.module.css';

type RatingPickerProps = {
  addRating: (ratingVariant: DayRating) => void;
  removeRating: () => void;
};

export const RatingPicker = ({ addRating, removeRating }: RatingPickerProps) => {
  const ratingVariants: DayRating[] = [1, 2, 3, 4, 5];

  return (
    <div className={s.root}>
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
  );
};
