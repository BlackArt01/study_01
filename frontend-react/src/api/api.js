// src/api/api.js
const API_URL = 'http://localhost:8000';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function fetchTasks() {
  return request(`${API_URL}/tasks`);
}

export function createTask(title) {
  return request(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed: false })
  });
}

export function updateTask(id, title, completed) {
  return request(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed })
  });
}

export function deleteTask(id) {
  return fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('Delete failed');
    });
}