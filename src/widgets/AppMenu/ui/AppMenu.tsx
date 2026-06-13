import clsx from 'clsx';
import { CalendarDays, ChartNoAxesColumnIncreasing, Map } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import s from './AppMenu.module.css';
import { UserMenu } from './UserMenu';

export const AppMenu = () => {
  return (
    <div className={s.root}>
      <h2 className={s.title}>Foundation</h2>
      <ul className={s.linksList}>
        <li className={s.linksItem}>
          <NavLink
            className={({ isActive }) => clsx(s.link, isActive && s.activeLink)}
            to="/yearTracker"
          >
            <CalendarDays className={s.icon} />
            Year Tracker
          </NavLink>
        </li>
        <li className={s.linksItem}>
          <NavLink
            className={({ isActive }) => clsx(s.link, isActive && s.activeLink)}
            to="/habits"
          >
            <ChartNoAxesColumnIncreasing className={s.icon} />
            Habits Tracker
          </NavLink>
        </li>
        <li className={s.linksItem}>
          <NavLink
            className={({ isActive }) => clsx(s.link, isActive && s.activeLink)}
            to="/objectives"
          >
            <Map className={s.icon} />
            Objectives
          </NavLink>
        </li>
      </ul>
      <UserMenu />
    </div>
  );
};
