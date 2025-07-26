const { io } = require('socket.io-client');

const socket = io('http://localhost:5000', {
  transports: ['websocket'],  // force WebSocket only (no polling)
  reconnectionAttempts: 5,    // retry 5 times
  timeout: 10000              // 10s connection timeout
});

socket.on('connect', () => {
  console.log('connected to server with ID:', socket.id);
});

socket.on('welcome', (data) => {
  console.log('server message:', data);
});

socket.on('connect_error', (err) => {
  console.error('connection error:', err.message);
});
