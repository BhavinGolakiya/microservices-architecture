# Microservices Architecture with Node.js, MongoDB, RabbitMQ, and WebSocket

This project is a full-fledged microservices system using:

- Node.js (Express) for REST APIs and Socket.IO
- MongoDB for persistence
- RabbitMQ for asynchronous messaging
- NGINX for reverse proxy and load balancing
- Docker for container orchestration

---

## Folder Structure

microservices-architecture/

    services/
        auth-service/ # Handles authentication & profile
        data-service/ # Consumes user events and stores profile
    concurrency-test/ # Load simulator with HTTP + WebSocket
    nginx/ # Reverse proxy configuration
    docker-compose.yml # Main orchestration file
    README.md # Setup instructions

---


## Features

- **JWT Authentication**
- **WebSocket Support** (`/socket`)
- **Load Balancing with NGINX**
- **RabbitMQ Queue: `user.created`**
- **Rate Limiting**
- **Concurrent Client Load Test**

---

## Requirements

- Docker
- Docker Compose

---

## Environment Variables

Each service uses these environment variables:

```env
auth env

PORT=4000
JWT_SECRET=supersecret
MONGO_URL=mongodb://mongo:27017/auth

Data env

PORT=5000
JWT_SECRET=supersecret
MONGO_URL=mongodb://mongo:27017/data
RABBITMQ_URL=amqp://rabbitmq


git clone https://github.com/BhavinGolakiya/microservices-architecture.git

cd microservices-architecture

docker-compose up --build

Concurrency Load Testing

go to this path /microservices-architecture/concurrency-test

run

node load_simulator.js

Postman API collection has been added inside the postman/ directory for easy access and testing.