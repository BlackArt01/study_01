import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import TasksPage from '../pages/TasksPage';
import StatsPage from '../pages/StatsPage';
import SettingsPage from '../pages/SettingsPage';

export default function AppRouter({ loading, error }) {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Route */}
        <Route path="/" element={
            <MainLayout loading={loading} error={error}>
              {/* routes */}
              <Route index element={<TasksPage />} />
            </MainLayout>
        }>
          {/* Index Route */}
          <Route index element={<TasksPage />} />

          {/* Child Routes */}
          <Route path="stats" element={<StatsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}