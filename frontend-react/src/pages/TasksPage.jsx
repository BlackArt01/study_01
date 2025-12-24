// src/pages/TasksPage.jsx
import { useEffect, useReducer, useState } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from '../api/api';
import TaskList from '../components/TaskList';
import EditTaskModal from '../components/EditTaskModal';
import { initialState, taskReducer } from '../state/taskReducer';



export default function TasksPage() {
  // 전역 상태 (업무 로직)
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { tasks, loading, error, editingTask } = state;

  // 로컬 UI 상태 (입력 필드)
  const [title, setTitle] = useState('');

  async function loadTasks() {
    dispatch({ type: 'LOADING_START' });

    try {
      const tasks = await fetchTasks();
      dispatch({ type: 'SET_TASKS', tasks });
    } catch {
      dispatch({ type: 'ERROR', error: 'Failed to load tasks' });
    } finally {
      dispatch({ type: 'LOADING_END' });
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
    dispatch({ type: 'EDIT_START', task });
  }

  function onCloseEdit() {
   dispatch({ type: 'EDIT_END' });
  }

  async function onSaveEdit(newTitle) {
    try {
      dispatch({ type: 'LOADING_START' });
      await updateTask(
        editingTask.id,
        newTitle,
        editingTask.completed
      );
      dispatch({ type: 'EDIT_END' });
      loadTasks();
    } finally {
      dispatch({ type: 'LOADING_END' });
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
          onClose={onCloseEdit}
        />
      )}  
    </div>
  );
}

