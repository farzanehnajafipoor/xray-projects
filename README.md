# XRay Test Projects

This repository contains two NestJS microservices communicating via RabbitMQ, and using MongoDB for storage:

- **Producer App**: Sends XRay messages to the RabbitMQ queue.
- **Consumer App**: Consumes messages from the queue and stores them in MongoDB.

Both apps can be run via Docker Compose with a single command.

---

## Table of Contents

- [Requirements](#requirements)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Run with Docker](#run-with-docker)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

---

## Requirements

- [Docker](https://www.docker.com/get-started)  
- [Docker Compose](https://docs.docker.com/compose/install/)

> You do **not** need Node.js or MongoDB/RabbitMQ installed locally, Docker handles everything.

---

## Setup

1. Clone the repository:

```bash
git clone https://github.com/farzanehnajafipoor/xray-projects.git
cd xray-projects
```

# environment-variables
2. Make sure each project has its .env file:

```bash
producer-app/.env
consumer-app/.env
```

Example for both:

```bash
# Producer .env
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# Consumer .env
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
MONGO_URL=mongodb://mongo:27017/xray
RABBITMQ_QUEUE=xray-queue
```

## Run with Docker
To build and run all containers:

```bash
docker-compose up --build
```

This will:
Build both producer and consumer apps.
Start MongoDB and RabbitMQ containers.
Automatically start producer and consumer apps.

```bash
3001 → Producer API
3000 → Consumer API
15672 → RabbitMQ Management Console
27017 → MongoDB
```

## Stop all containers:

```bash
docker-compose down
```

## API Endpoints
# Producer App (http://localhost:3001)
```bash
POST /send-xray – Send a test XRay message to the queue.
```

Example:

```bash
curl -X POST http://localhost:3001/send-xray
```

# Consumer App (http://localhost:3000)
```bash
GET /signals – Retrieve all processed messages from MongoDB.
POST /signals – Add a signal manually.
GET /signals/:id – Retrieve a specific signal.
PUT /signals/:id – Update a signal.
DELETE /signals/:id – Delete a signal.
```

## Project Structure
```bash
.
├── consumer-app/
│   ├── src/
│   ├── dist/        # Build output
│   ├── .env
│   └── Dockerfile
├── producer-app/
│   ├── src/
│   ├── dist/        # Build output
│   ├── .env
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

