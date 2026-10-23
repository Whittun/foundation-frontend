import { getLocalDayKey } from '@/shared';
import React from 'react';

const ACTIVE_DAY_STORAGE_KEY = 'taskBoardActiveDay';
const DAY_CHECK_INTERVAL = 60000;

export const useActiveDay = (
  setIsDaySummaryOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const [activeDay, setActiveDay] = React.useState(
    () => localStorage.getItem(ACTIVE_DAY_STORAGE_KEY) ?? getLocalDayKey(),
  );

  const checkActiveDay = React.useCallback(() => {
    if (activeDay !== getLocalDayKey()) {
      setIsDaySummaryOpen(true);
    }
  }, [activeDay, setIsDaySummaryOpen]);

  React.useEffect(() => {
    localStorage.setItem(ACTIVE_DAY_STORAGE_KEY, activeDay);
  }, [activeDay]);

  const handleStartNewDay = () => {
    setActiveDay(getLocalDayKey());
    setIsDaySummaryOpen(false);
  };

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkActiveDay();
      }
    };

    checkActiveDay();

    window.addEventListener('focus', checkActiveDay);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const intervalId = window.setInterval(checkActiveDay, DAY_CHECK_INTERVAL);

    return () => {
      window.removeEventListener('focus', checkActiveDay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [checkActiveDay]);

  return {
    handleStartNewDay,
    activeDay,
  };
};
