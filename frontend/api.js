const API_URL = 'http://localhost:8000'; // Your API base URL here

async function request(url, options = {} ) {
    const res = await fetch(url, options);
    
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`); 
    }

    return res.json();
}

export function apiFetchTasks() {
    return request(`${API_URL}/tasks`);
}

export function apiCreateTask(title) {
    return request(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title, completed: false })
    });
}

export function apiToggleTask(task) {
    return request(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: task.title, completed: !task.completed })
    });
}

export function apiDeleteTask(id) {
    return request(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
    });
}

export function apiUpdateTask(id, title, completed) {
    return request(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title, completed: completed })
    });
}