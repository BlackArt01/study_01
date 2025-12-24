// src/components/TaskItem.jsx
export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <li style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
      {task.title}

      <button onClick={() => onEdit(task)} style={{ marginLeft: '8px' }}>
        Edit
      </button>
      <button onClick={() => onToggle(task)} style={{ marginLeft: '4px' }}>
        {task.completed ? 'Undo' : 'Done'}
      </button>
      <button onClick={() => onDelete(task.id)} style={{ marginLeft: '4px' }}>
        Delete
      </button>
    </li>
  );
}