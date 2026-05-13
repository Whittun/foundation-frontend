import { Check } from 'lucide-react';
import s from './CompletedTag.module.css';
import clsx from 'clsx';

type CompletedTagProps = {
  className?: string;
};

export const CompletedTag = ({ className }: CompletedTagProps) => {
  return (
    <div className={clsx(s.completedText, className)}>
      <div className={s.completedTextCircle}>
        <Check className={s.checkIcon} />
      </div>
      Completed
    </div>
  );
};
