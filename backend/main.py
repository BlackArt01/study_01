from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

# Initialize the application
# In C++, this would be like initializing your main application class or server instance.
app = FastAPI()

# Configure CORS (Cross-Origin Resource Sharing)
# This allows our frontend (which might run on a different port during dev) to talk to this backend.
# In a C++ server, you might handle this by setting specific HTTP headers in your response middleware.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- Data Models ---

# Pydantic models are similar to C++ structs or classes with validation.
# They define the shape of data we expect to receive or send.
class Task(BaseModel):
    id: Optional[int] = None # Optional[int] is like std::optional<int> or int*
    title: str               # str is like std::string
    completed: bool = False  # bool is bool. Default value is False.

# --- In-Memory Storage ---

# We'll use a simple list to store tasks.
# In C++, this would be a std::vector<Task> tasks;
# Since Python lists are dynamic, we don't need to reserve space.
tasks: List[Task] = []
current_id_counter = 1

# --- API Endpoints ---

# GET /tasks
# Returns the list of all tasks.
# @app.get decorator registers this function to handle GET requests at "/tasks".
@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return tasks

# POST /tasks
# Creates a new task.
# The 'task' argument is automatically parsed from the JSON body of the request.
@app.post("/tasks", response_model=Task)
def create_task(task: Task):
    global current_id_counter
    # Assign an ID to the new task
    task.id = current_id_counter
    current_id_counter += 1
    
    # Add to our "vector"
    tasks.append(task)
    return task

# PUT /tasks/{task_id}
# Updates an existing task.
@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, updated_task: Task):
    # Find the task in the list
    # In C++, you might use std::find_if
    for i, t in enumerate(tasks):
        if t.id == task_id:
            # Update fields
            tasks[i].title = updated_task.title
            tasks[i].completed = updated_task.completed
            tasks[i].id = task_id # Ensure ID stays the same
            return tasks[i]
    
    # If not found, throw 404
    raise HTTPException(status_code=404, detail="Task not found")

# DELETE /tasks/{task_id}
# Deletes a task.
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    global tasks
    # Filter out the task to delete
    # In C++, this is like the erase-remove idiom:
    # tasks.erase(std::remove_if(tasks.begin(), tasks.end(), ...), tasks.end());
    initial_count = len(tasks)
    tasks = [t for t in tasks if t.id != task_id]
    
    if len(tasks) == initial_count:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {"message": "Task deleted"}

# Serve static files (Frontend)
# This tells FastAPI to serve files from the '../frontend' directory at the root URL.
# It's like configuring a web server (Nginx/Apache) or writing a file handler in C++.
# Get the directory of the current file
BASE_DIR = Path(__file__).resolve().parent
# Resolve the frontend directory relative to this file
FRONTEND_DIR = BASE_DIR.parent / "frontend"

app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="static")
