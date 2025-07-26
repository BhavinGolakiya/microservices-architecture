require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// middleware to inject replica ID in headers
app.use((req, res, next) => {
  res.setHeader('x-replica-id', process.env.REPLICA_ID || 'auth-1');
  next();
});

app.use(bodyParser.json());
// app.use(rateLimit({ windowMs: 60 * 1000, max: 10000 }));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("mongoDB connected"))
  .catch(console.error);

app.use('/', authRoutes);

// setup socket.IO on this server
const io = new Server(server, {
  path: '/socket',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  const replicaId = process.env.REPLICA_ID || 'auth-1';
  console.log('webSocket connected:', socket.id);

  socket.emit('pong', { replicaId });

  socket.on('ping', (data) => {
    socket.emit('pong', { clientId: data.clientId, replicaId });
  });

  socket.on('disconnect', () => {
    console.log('webSocket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`auth Service running on port ${PORT}`));
