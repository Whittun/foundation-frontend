import {
  useDeleteDayRatingMutation,
  useGetYearRatingsQuery,
  useSetDayRatingMutation,
} from '@/features/YearTracker/api/dayRatingsApi';
import { monthsNames, weekDays } from '@/features/YearTracker/lib/consts';
import { getCalendarMonths } from '@/features/YearTracker/lib/getCalendarMonths';
import type { DayRating } from '@/features/YearTracker/model/types';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { DayPopover } from '../DayPopover/DayPopover';
import { DayNoteModal } from '../DayNoteModal';
import s from './YearTracker.module.css';

export const YearTracker = () => {
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  const { data, isLoading, isError } = useGetYearRatingsQuery(currentYear);
  const [setDayRating] = useSetDayRatingMutation();
  const [deleteDayRating] = useDeleteDayRatingMutation();

  const [activeDate, setActiveDate] = React.useState<string | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = React.useState(false);

  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const popoverRefCurrent = popoverRef.current;
      const eventTarget = event.target;

      if (popoverRefCurrent === null) {
        return;
      }

      if (!(eventTarget instanceof Node)) {
        return;
      }

      if (!popoverRefCurrent.contains(eventTarget) && activeDate !== null) {
        setActiveDate(null);
      }
    };

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, [activeDate]);

  if (isError) {
    return <div>error!</div>;
  }

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return null;
  }

  const months = getCalendarMonths(data);

  const toggleActiveDate = (date: string) => {
    if (date === activeDate) {
      setActiveDate(null);
      return;
    }

    setActiveDate(date);
  };

  const handlePickRating = (ratingVariant: DayRating) => {
    if (activeDate === null) return;

    setDayRating({
      date: activeDate,
      rating: ratingVariant,
    });
  };

  const handleRemoveRating = () => {
    if (activeDate === null) return;

    deleteDayRating({ date: activeDate });
  };

  const handleOpenNoteModal = () => {
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
  };

  const handleCurrentYear = (direction: 'back' | 'next') => {
    if (direction === 'next') {
      setCurrentYear((prevYear) => {
        return prevYear + 1;
      });
    }

    if (direction === 'back') {
      setCurrentYear((prevYear) => {
        return prevYear - 1;
      });
    }
  };

  return (
    <React.Fragment>
      <div className={s.yearPicker}>
        <button className={s.yearControl} onClick={() => handleCurrentYear('back')}>
          <ChevronLeft />
        </button>
        {currentYear}
        <button className={s.yearControl} onClick={() => handleCurrentYear('next')}>
          <ChevronRight />
        </button>
      </div>
      <div className={s.year}>
        {months.map((month, index) => {
          return (
            <div key={monthsNames[index]} className={s.month}>
              <h2 className={s.monthName}>{monthsNames[index]}</h2>
              <div className={s.weekDays}>
                {weekDays.map((weekDay) => {
                  return <div className={s.weekDay}>{weekDay}</div>;
                })}
              </div>
              <div className={s.daysGreed}>
                {month.map((date, index) => {
                  if (date === null) {
                    return (
                      <div key={index} className={clsx(s.day, s.emptyDay)}>
                        <span></span>
                      </div>
                    );
                  }

                  const [, , day] = date.split('-');

                  return (
                    <div
                      key={date}
                      className={clsx(s.day, data[date] !== null && s[`rating-${data[date]}`])}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleActiveDate(date);
                      }}
                    >
                      {activeDate === date && (
                        <div ref={popoverRef} onClick={(event) => event.stopPropagation()}>
                          <DayPopover
                            removeRating={handleRemoveRating}
                            addRating={handlePickRating}
                            openNote={handleOpenNoteModal}
                          />
                        </div>
                      )}
                      <span>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <DayNoteModal isOpen={isNoteModalOpen} onClose={handleCloseNoteModal} />
    </React.Fragment>
  );
};
