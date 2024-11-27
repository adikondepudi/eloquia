#!/bin/bash

# dev.sh
# Make sure to save this in the root directory (speech-fluency/)

# Check if Python virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
else
    echo "Python virtual environment exists"
fi

# Function to cleanup background processes on script exit
cleanup() {
    echo "Cleaning up processes..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Start backend server
echo "Starting backend server..."
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload &

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm run dev &

# Keep script running
wait