import { useEffect, useState } from 'react';
import { fetchTasks } from '../api/api';
import useAsync from '../hooks/useAsync';

export default function StatsPage() {
  const { run, loading, error } = useAsync();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    run(async () => {
      const tasks = await fetchTasks();
      const completed = tasks.filter(t => t.completed).length;

      setStats({
        total: tasks.length,
        completed
      });
    });
  }, []);

  if (!stats) return null;

  return (
    <div>
      <h2>Stats</h2>
      <p>Total: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
    </div>
  );
}
