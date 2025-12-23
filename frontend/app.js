import { state } from './state.js';
import { apiFetchTasks, apiCreateTask, apiToggleTask, apiDeleteTask } from './api.js';
import { render } from './ui.js';       

const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');  

function getTitle() {
    return taskInput.value.trim();
}

function updateAddBtn() {
    if(!getTitle()) {
        addBtn.disabled = true;
    } else {
        addBtn.disabled = false;
    }
}

addBtn.addEventListener('click', onAdd);
taskInput.addEventListener('input', updateAddBtn);
taskList.addEventListener('keydown', e => {
    if (e.isComposing) return;

    if (e.key === 'Enter') {
        e.preventDefault();
        onAdd();
    }
});

taskList.addEventListener('click', async (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    const li = e.target.closest('li');
    const id = Number(li.dataset.id);
    const task = state.tasks.find(t => t.id === id);

    try {
        state.loading = true;
        render();

        if (action === 'toggle') {
            await apiToggleTask(task);
        } else if (action === 'delete') {
            await apiDeleteTask(id);
        }

        await loadTasks();
    } catch (error) {
        state.errorMessage = error.message;
    } finally {
        state.loading = false;
        render();
    }   
});

async function onAdd() {
    const title = getTitle();
    if (!title) return;

    try {
        state.loading = true;
        render();

        await apiCreateTask({ title });
        taskInput.value = '';
        updateAddBtn();
        await loadTasks();
        
    } catch (error) {
        state.errorMessage = error.message;
    } finally {
        state.loading = false;
        render();
    }
}

async function loadTasks() {
    try {
        const tasks = await apiFetchTasks();
        state.errorMessage = null;
    } catch (error) {
        state.errorMessage = 'Failed to load tasks';
    } finally {
        state.loading = false;
        render();
    }
}

updateAddBtn();
loadTasks().then(render);