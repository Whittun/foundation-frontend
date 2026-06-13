import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../../layout';
import { YearTrackerPage } from '../../pages/YearTrackerPage';
import { HabitsPage } from '../../pages/HabitsPage';
import { Habits, HabitsIndex } from '../../features/Habits';
import { ObjectivesPage } from '../../pages/ObjectivesPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={'Main Page!'} />
          <Route path="/yearTracker" element={<YearTrackerPage />} />
          <Route path="/habits" element={<HabitsPage />}>
            <Route index element={<HabitsIndex />} />
            <Route path=":habitId" element={<Habits />} />
          </Route>
          <Route path="/objectives" element={<ObjectivesPage />} />
        </Route>
      </Route>

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};
