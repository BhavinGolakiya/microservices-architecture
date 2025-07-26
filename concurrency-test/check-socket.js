const { io } = require('socket.io-client')

const socket = io('http://localhost:5000', {
  path: '/socket',
  transports: ['websocket'],
});


socket.on('connect', () => {
  console.log('connected to server with id:', socket.id)
});

socket.on('connect_error', (err) => {
  console.error('onnection error:', err.message)
});

socket.on('welcome', (data) => {
  console.log('server message:', data)
});
