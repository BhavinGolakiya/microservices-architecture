const axios = require('axios');
const { io } = require('socket.io-client');
const { v4: uuidv4 } = require('uuid');

const HTTP_URL = 'http://localhost:4000/login';       
const WS_URL = 'http://localhost:5000';

const TOTAL_CLIENTS = 1000;
const LOG_INTERVAL = 50;

const httpClients = [];
const socketClients = [];

async function simulateHttpRequest(clientId) {
  const email = `testuser${clientId}@mail.com`;
  const password = 'test1234';

  try {
    await axios.post('http://localhost:4000/signup', { email, password });

    const res = await axios.post(HTTP_URL, { email, password });
    const token = res.data.token;

    if (clientId % LOG_INTERVAL === 0) {
      console.log(`[HTTP][${clientId}] Response from Replica:`, res.headers['x-replica-id'] || 'Unknown');
    }

    return token;
  } catch (err) {
    console.error(`[HTTP][${clientId}] Error:`, err.response?.status || err.message);
    return null;
  }
}

function simulateWebSocket(clientId, token) {
  if (!token) return;

  const socket = io(WS_URL, {
    transports: ['websocket'],
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    query: {
      clientId: uuidv4()
    }
  });

  socket.on('connect', () => {
    if (clientId % LOG_INTERVAL === 0) {
      console.log(`[WS][${clientId}] Connected`);
    }
    socket.emit('ping', { clientId });
  });

  socket.on('pong', (message) => {
    if (clientId % LOG_INTERVAL === 0) {
      console.log(`[WS][${clientId}] Message from Replica:`, message.server || message.replicaId || 'Unknown');
    }
  });

  socket.on('welcome', (data) => {
    if (clientId % LOG_INTERVAL === 0) {
      console.log(`[WS][${clientId}] Welcome Message:`, data.message);
    }
  });

  socket.on('connect_error', (err) => {
    console.error(`[WS][${clientId}] Connection error:`, err.message);
  });

  socketClients.push(socket);
}

async function main() {
  console.log(`Starting simulation with ${TOTAL_CLIENTS} HTTP + WebSocket clients...\n`);

  for (let i = 0; i < TOTAL_CLIENTS; i++) {
    const tokenPromise = simulateHttpRequest(i);
    tokenPromise.then(token => simulateWebSocket(i, token));
    httpClients.push(tokenPromise);
  }

  await Promise.all(httpClients);
  console.log('\nall HTTP requests completed');

  setTimeout(() => {
    console.log('\nClosing all WebSocket connections');
    socketClients.forEach(socket => socket.close());
  }, 30000);
}

main();
