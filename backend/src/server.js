require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const { initRedis, getRedis } = require('./config/redis');
const logger = require('./utils/logger');
const setupSockets = require('./sockets');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', credentials: true } });

app.set('io', io);

(async () => {
  await connectDB();
  initRedis();
  setupSockets(io);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
})();
