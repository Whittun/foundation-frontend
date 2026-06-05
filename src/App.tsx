import './App.css';
import './variables.css';

import { Route, Routes } from 'react-router-dom';
import { YearTrackerPage } from './pages/YearTrackerPage';
import { AppLayout } from './layout';
import { Habits } from './components/Habits';
import { HabitsPage } from './pages/HabitsPage';
import { HabitsIndex } from './components/HabitsIndex';
import { ObjectivesPage } from './pages/ObjectivesPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={'Main Page!'} />
        <Route path="/yearTracker" element={<YearTrackerPage />} />
        <Route path="/habits" element={<HabitsPage />}>
          <Route index element={<HabitsIndex />} />
          <Route path=":habitId" element={<Habits />} />
        </Route>
        <Route path="/objectives" element={<ObjectivesPage />} />
      </Route>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
