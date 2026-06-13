import React from 'react';
import { Outlet } from 'react-router-dom';
import { HabitsMenu } from '../../../components/HabitsMenu';
import s from './HabitsPage.module.css';

export const HabitsPage = () => {
  const [isShowForm, setIsShowForm] = React.useState(false);

  const handleOpenForm = () => {
    setIsShowForm((prev) => !prev);
  };

  return (
    <div className={s.root}>
      <div className={s.levelsWrapper}>{<Outlet context={{ handleOpenForm }} />}</div>
      <HabitsMenu
        isShowForm={isShowForm}
        handleOpenForm={handleOpenForm}
        setIsShowForm={setIsShowForm}
      />
    </div>
  );
};
