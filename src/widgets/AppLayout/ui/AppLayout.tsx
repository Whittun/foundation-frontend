import { Outlet } from 'react-router-dom';
import { AppMenu } from '../../AppMenu';
import s from './AppLayout.module.css';

export const AppLayout = () => {
  return (
    <div className={s.root}>
      <aside className={s.aside}>
        <AppMenu />
      </aside>
      <main className={s.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};
