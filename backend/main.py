from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from db import init_db, get_db, close_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    init_db()
    yield
    # shutdown
    close_db()

# Initialize the application
# In C++, this would be like initializing your main application class or server instance.
#app = FastAPI()
app = FastAPI(lifespan=lifespan)

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
@app.get("/tasks")
def get_tasks():
    conn = get_db()
    rows = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    return [dict(row) for row in rows]

# POST /tasks
# Creates a new task.
# The 'task' argument is automatically parsed from the JSON body of the request.
@app.post("/tasks")
def create_task(task: Task):
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO tasks(title, completed) VALUES (?, ?)",
        (task.title, int(task.completed))
    )
    conn.commit()
    conn.close()
    return { "id": cur.lastrowid, **task.dict() }

# PUT /tasks/{task_id}
# Updates an existing task.
@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: Task):
    conn = get_db()
    conn.execute(
        "UPDATE tasks SET title=?, completed=? WHERE id=?",
        (task.title, int(task.completed), task_id)
    )
    conn.commit()
    conn.close()
    return task

# DELETE /tasks/{task_id}
# Deletes a task.
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    conn = get_db()
    conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
    conn.commit()
    conn.close()

# Serve static files (Frontend)
# This tells FastAPI to serve files from the '../frontend' directory at the root URL.
# It's like configuring a web server (Nginx/Apache) or writing a file handler in C++.
# Get the directory of the current file
BASE_DIR = Path(__file__).resolve().parent
# Resolve the frontend directory relative to this file
FRONTEND_DIR = BASE_DIR.parent / "frontend"

app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="static")
