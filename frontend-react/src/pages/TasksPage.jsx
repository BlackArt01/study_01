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
import useAsync from '../hooks/useAsync';


export default function TasksPage() {
  // 전역 상태 (업무 로직)
  const [state, dispatch] = useReducer(taskReducer, initialState);
  // const { tasks, editingTask } = state;
  const { run, loading, error } = useAsync();
  
  // 로컬 UI 상태 (입력 필드)
  // 페이지 전용 UI 상태
  const [title, setTitle] = useState('');

    // 페이지 진입 시 한 번만 실행
    useEffect(() => {
      loadTasks();
    }, []);

  async function loadTasks() {
    const tasks = await run(() => fetchTasks());
    dispatch({ type: 'SET_TASKS', tasks });
  }

  async function onAdd() {
    if (!title.trim()) return;

    await run(() => createTask(title.trim()));
    setTitle('');
    loadTasks();
  }

  async function onToggle(task) {
    await run(() => updateTask(task.id, task.title, !task.completed));
    loadTasks();
  }

  async function onDelete(id) {
    await run(() => deleteTask(id));
    loadTasks();
  }

  function onEdit(task) {
    dispatch({ type: 'EDIT_START', task });
  }

  function onCloseEdit() {
   dispatch({ type: 'EDIT_END' });
  }

  async function onSaveEdit(newTitle) {
    await run(() =>
      updateTask(editingTask.id, newTitle, editingTask.completed)
    );
    dispatch({ type: 'EDIT_END' });
    loadTasks();
  }

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
