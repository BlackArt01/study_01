import sys
import os
from pathlib import Path

# Add current directory to sys.path
sys.path.append(os.getcwd())

print(f"Running verification from: {os.getcwd()}")

try:
    # This import should trigger the code in main.py
    from backend import main
    print("SUCCESS: backend.main imported successfully.")
    print(f"Resolved FRONTEND_DIR: {main.FRONTEND_DIR}")
    if main.FRONTEND_DIR.exists():
        print("CONFIRMED: Directory exists.")
    else:
        print("ERROR: Directory does not exist (unexpected if import succeeded).")
except Exception as e:
    print(f"FAILURE: Could not import backend.main. Error: {e}")
    sys.exit(1)
