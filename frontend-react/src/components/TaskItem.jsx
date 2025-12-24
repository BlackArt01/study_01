// src/components/TaskItem.jsx
export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
      {task.title}
      <button onClick={() => onToggle(task)}>Done</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}
