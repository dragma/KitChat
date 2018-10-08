import SocketManager from '../utils/SocketManager';

const timeouts = {};

const manageTyping = (socket) => {
  socket.emit('typing', true);
  if (timeouts[socket.id]) {
    clearTimeout(timeouts[socket.id]);
  }

  timeouts[socket.id] = setTimeout(() => socket.emit('typing', false), 5000);
};

const sendTyping = socket => async () => {
  const room_id = SocketManager.getRoomIdBySocket(socket);
  const sockets = SocketManager.getSocketsByRoomId(room_id);

  sockets
    .filter(s => s.user._id !== socket.user._id)
    .forEach(s => manageTyping(s));
};

export default sendTyping;
