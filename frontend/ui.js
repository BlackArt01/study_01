import { state } from './state.js';

const taskList = document.getElementById('task-list');
const statusElement = document.getElementById('status');

export function render() {
    renderState();
    renderTasks();
}

function renderState() {
    if (state.loading) {
        statusElement.textContent = 'Loading...';
        statusElement.className = 'status loading';
    } else if (state.errorMessage) {
        statusElement.textContent = state.errorMessage;
        statusElement.className = 'status error';
    } else {
        statusElement.textContent = '';
        statusElement.className = 'status';
    }
}

function renderTasks() {
    taskList.innerHTML = ''; // Clear current list
    
    state.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <span>${task.title}</span>
            <div class="actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Done'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
}

