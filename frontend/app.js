// Base URL for our API
const API_URL = 'http://localhost:8000';

// DOM Elements
// In C++, this is like getting pointers to your UI widgets.
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');


// 입력값을 "검증된 제목"으로 정규화.
function getNormalizedTitle() {
    return taskInput.value.trim();   // 공백 제거
}

// 입력 상태에 따라 Add 버튼 활성 / 비활성.
// 입력 상태에 따라 Add 버튼 활성 / 비활성.
function updateAddButtonState() {
    const title = getNormalizedTitle();
    if (title.length === 0) {
        addBtn.disabled = true;
    } else {
        addBtn.disabled = false;
    }
}


/** Add 동작을 한 곳으로 모으기 (클릭/엔터 모두 여기로) */
function onAddTask() {
    const title = getNormalizedTitle();
    if (!title) return;
    createTask(title);
    taskInput.value = '';
    updateAddButtonState();
}

// --- Event Listeners ---
// Similar to connecting signals and slots in Qt or callbacks in other C++ GUI frameworks.

addBtn.addEventListener('click', onAddTask);

// 입력이 바뀔 때마다 버튼 상태 갱신
taskInput.addEventListener('input', updateAddButtonState);

taskInput.addEventListener('keydown', (e) => {
    // 한글 입력(IME) 조함 중 Enter는 무시 ( 실수 방지용 )
    if (e.isComposing) return;

    updateAddButtonState();

    if (e.key === 'Enter') {
        e.preventDefault();
        onAddTask();
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
updateAddButtonState();
fetchTasks();
