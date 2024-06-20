# Scheduler System

This is a simple scheduler system built with Node.js, Express, and MongoDB for the backend and React for the Frontend and Redis for queuing. It is containerized using Docker for easy deployment.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Docker](#docker)

## Features

- Create, read, update, and delete tasks.
- Stores logs in a `taskLogs.json` file.
- Uses MongoDB for data storage.
- Uses Redis for queuing.
- Easily deployable with Docker.
- Frontend interface for interacting with the scheduler.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [MongoDB](https://www.mongodb.com/) (running locally or remotely)
- [Redis](https://redis.io/) (running locally or remotely)
- [Docker](https://www.docker.com/) (for containerization)

## Installation


### Backend

1. Clone the repository:

    ```bash
    git clone https://github.com/SuperFSDev/Scheduler.git
    cd Scheduler/backend
    ```

2. Install backend dependencies:

    ```bash
    npm install
    ```

### Frontend

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install frontend dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend` directory and add the backend URL (if needed):

    ```env
    PORT = 3001
    ```

## Usage

### Backend

1. Start the MongoDB and Redis servers if they are not already running.

2. Start the Express server:

    ```bash
    cd backend
    npm run build
    npm start
    ```

3. The server will run on `http://localhost:3000`.

### Frontend

1. Start the frontend development server:

    ```bash
    cd frontend
    npm start
    ```

2. The frontend will typically run on `http://localhost:3001` or another port if specified.

## API Routes

- **GET `/logs`**: Retrieve all logs.
- **Task Routes**: Handled by `taskRouter` (e.g., `/api/tasks` for CRUD operations).

## Docker

To build and run the application using Docker:

1. Build the Docker image:

    ```bash
    docker compose build.
    ```

2. Run the Docker containers:

    ```bash
    docker-compose up
    ```

3. The backend server will run on `http://localhost:3000` and the frontend will run on `http://localhost:3001` or another specified port.
