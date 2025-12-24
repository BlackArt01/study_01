// src/pages/App.jsx
import { useEffect, useState } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from '../api/api';
import TaskList from '../components/TaskList';
import EditTaskModal from '../components/EditTaskModal';


export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  async function loadTasks() {
    try {
      setLoading(true);
      setTasks(await fetchTasks());
      setError(null);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  async function onAdd() {
    if (!title.trim()) return;
    await createTask(title.trim());
    setTitle('');
    loadTasks();
  }

  async function onToggle(task) {
    await updateTask(task.id, task.title, !task.completed);
    loadTasks();
  }

  async function onDelete(id) {
    await deleteTask(id);
    loadTasks();
  }

  function onEdit(task) {
    setEditingTask(task);
  }

  async function onSaveEdit(newTitle) {
    try {
      setLoading(true);
      await updateTask(
        editingTask.id,
        newTitle,
        editingTask.completed
      );
      setEditingTask(null);
      loadTasks();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <h2>Task Board (React)</h2>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={onAdd} disabled={!title.trim()}>
        Add
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <TaskList
        tasks={tasks}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={onSaveEdit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

