require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const socketIo = require('socket.io');
const profileRoutes = require('./routes/profile.routes');
const consumeUserCreated = require('./queue/consumer'); // RabbitMQ consumer

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'], // Force websocket only (optional)
});

// middleware
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// mongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('mongoDB connected for data-service'))
  .catch(err => console.error('mongoDB connection error:', err));

// routes
app.use('/api/profile', profileRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Data Service Healthy' });
});

// Socket.IO setup
io.on('connection', (socket) => {
  console.log(`socket connected: ${socket.id}`);

  // Send welcome message
  socket.emit('welcome', { message: 'Welcome from data-service!' });

  socket.on('status-update', (data) => {
    console.log('status update received:', data);
    io.emit('status-broadcast', data);
  });

  socket.on('disconnect', () => {
    console.log(`socket disconnected: ${socket.id}`);
  });
});

// RabbitMQ Consumer (passing io to emit socket events)
consumeUserCreated(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`data service running on port ${PORT}`);
});

// handle uncaught errors gracefully
process.on('uncaughtException', (err) => {
  console.error('uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandled Rejection at:', promise, 'reason:', reason);
});
