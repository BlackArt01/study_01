// Base URL for our API
const API_URL = 'http://localhost:8000';

// DOM Elements
// In C++, this is like getting pointers to your UI widgets.
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// --- Event Listeners ---
// Similar to connecting signals and slots in Qt or callbacks in other C++ GUI frameworks.

addBtn.addEventListener('click', () => {
    const title = taskInput.value;
    if (title) {
        createTask(title);
        taskInput.value = ''; // Clear input
    }
});

// Allow pressing "Enter" to add task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

// --- Functions ---

// Fetch all tasks from the backend
// This is an asynchronous function (async/await).
// In C++, this would be like running a network request in a separate thread and waiting for a future/promise.
async function fetchTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Create a new task
async function createTask(title) {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title, completed: false })
        });

        if (response.ok) {
            fetchTasks(); // Refresh list
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

// Update task status (Complete/Incomplete)
async function toggleTask(id, currentTitle, currentStatus) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: currentTitle, completed: !currentStatus })
        });

        if (response.ok) {
            fetchTasks();
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchTasks();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Render the list of tasks to the DOM
// In C++, this would be your "paint" or "draw" function, or where you update your widget model.
function renderTasks(tasks) {
    taskList.innerHTML = ''; // Clear current list

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        const span = document.createElement('span');
        span.textContent = task.title;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = task.completed ? 'Undo' : 'Done';
        completeBtn.onclick = () => toggleTask(task.id, task.title, task.completed);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.id);

        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(actionsDiv);

        taskList.appendChild(li);
    });
}

// Initial load
fetchTasks();
