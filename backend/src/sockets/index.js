const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (io) => {
  // Auth middleware cho socket
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          socket.userId = user._id.toString();
          socket.isAdmin = user.isAdmin;
        }
      } catch (err) {
        // anonymous user
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id} (user: ${socket.userId || 'guest'})`);

    // Admin join room
    socket.on('admin:join', () => {
      if (socket.isAdmin) {
        socket.join('admins');
        console.log(`👑 Admin joined: ${socket.userId}`);
      }
    });

    // User join room riêng
    socket.on('user:join', (userId) => {
      if (socket.userId === userId) {
        socket.join(`user:${userId}`);
      }
    });

    // Customer support chat
    socket.on('chat:message', (data) => {
      if (socket.isAdmin) {
        io.to(`user:${data.userId}`).emit('chat:reply', data);
      } else if (socket.userId) {
        io.to('admins').emit('chat:new', { ...data, userId: socket.userId });
      }
    });

    // Live view product
    socket.on('product:view', (productId) => {
      socket.join(`product:${productId}`);
      io.to(`product:${productId}`).emit('viewer:count', io.sockets.adapter.rooms.get(`product:${productId}`)?.size || 0);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};
