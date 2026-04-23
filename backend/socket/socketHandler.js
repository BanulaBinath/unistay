const jwt = require('jsonwebtoken');

/**
 * Initialize Socket.IO with authentication
 */
const initializeSocket = (io) => {
  // Socket.IO authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.userRole})`);

    // Join user-specific room
    socket.join(`user_${socket.userId}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });

    // Handle notification read event
    socket.on('notification:read', (notificationId) => {
      console.log(`Notification ${notificationId} marked as read by user ${socket.userId}`);
    });

    // Handle typing indicators for tickets (optional future feature)
    socket.on('ticket:typing', (data) => {
      socket.to(`ticket_${data.ticketId}`).emit('ticket:typing', {
        userId: socket.userId,
        ticketId: data.ticketId
      });
    });
  });

  return io;
};

/**
 * Get Socket.IO instance
 */
let ioInstance = null;

const setSocketInstance = (io) => {
  ioInstance = io;
};

const getSocketInstance = () => {
  return ioInstance;
};

module.exports = {
  initializeSocket,
  setSocketInstance,
  getSocketInstance
};
