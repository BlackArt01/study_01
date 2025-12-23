import sqlite3

def get_db():
    conn = sqlite3.connect('tasks.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER NOT NULL CHECK (completed IN (0, 1))
        )
    ''')
    conn.commit()
    conn.close()


def close_db():
    conn = get_db()
    conn.close()