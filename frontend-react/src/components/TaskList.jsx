// src/components/TaskList.jsx
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
