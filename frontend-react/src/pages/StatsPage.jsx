import { useEffect, useState } from 'react';
import { fetchTasks } from '../api/api';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);

    const tasks = await fetchTasks();
    const completed = tasks.filter(t => t.completed).length;

    setStats({
      total: tasks.length,
      completed
    });

    setLoading(false);
  }

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return null;

  return (
    <div>
      <h2>Stats</h2>
      <p>Total: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
    </div>
  );
}