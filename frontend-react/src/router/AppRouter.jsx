import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TasksPage from '../pages/TasksPage';
import StatsPage from '../pages/StatsPage';
import SettingsPage from '../pages/SettingsPage';
import Navbar from '../components/Navbar';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
