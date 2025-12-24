import { useState } from 'react';

export default function EditTaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title);

  function handleSave() {
    const value = title.trim();
    if (!value) return;
    onSave(value);
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Edit Task</h3>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />

        <div style={{ marginTop: '12px', textAlign: 'right' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave} style={{ marginLeft: '8px' }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* 간단한 스타일 (CSS로 분리해도 됨) */
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalStyle = {
  background: '#222',
  color: '#fff',
  padding: '16px',
  borderRadius: '6px',
  width: '320px'
};
