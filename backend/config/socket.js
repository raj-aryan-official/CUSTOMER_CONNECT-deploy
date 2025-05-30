const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user._id);

    // Join user's personal room
    socket.join(`user_${socket.user._id}`);

    // Join shop room if user is a shop owner
    if (socket.user.role === 'shop_owner') {
      socket.join(`shop_${socket.user._id}`);
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user._id);
    });
  });

  return io;
};

// Function to emit notification to specific user
const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification', notification);
  }
};

// Function to emit notification to shop
const emitShopNotification = (shopId, notification) => {
  if (io) {
    io.to(`shop_${shopId}`).emit('shop_notification', notification);
  }
};

// Function to emit order status update
const emitOrderUpdate = (orderId, update) => {
  if (io) {
    io.to(`order_${orderId}`).emit('order_update', update);
  }
};

// Function to emit cart update
const emitCartUpdate = (userId, update) => {
  if (io) {
    io.to(`user_${userId}`).emit('cart_update', update);
  }
};

module.exports = {
  initializeSocket,
  emitNotification,
  emitShopNotification,
  emitOrderUpdate,
  emitCartUpdate
}; 