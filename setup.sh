#!/bin/bash

# Check and install Python and pip
echo "Checking and installing Python and pip..."
if ! command -v python3 &> /dev/null
then
    echo "Python3 is not installed. Please install Python3 first."
    exit
fi

if ! command -v pip3 &> /dev/null
then
    echo "pip3 is not installed. Installing pip3..."
    python3 -m ensurepip --upgrade
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt

# Start backend service
echo "Starting backend service..."
nohup python3 app.py &

# Check and install Node.js 21 and npm
echo "Checking and installing Node.js 21 and npm..."
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Installing Node.js 21..."
    curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Start frontend service
echo "Starting frontend service..."
npm start
