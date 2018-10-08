import SocketManager from '../utils/SocketManager';

const timeouts = {};

const manageTyping = (socket, room_id) => {
  socket.emit('typing', true);
  if (timeouts[room_id]) {
    clearTimeout(timeouts[room_id]);
  }
  timeouts[room_id] = setTimeout(() => socket.emit('typing', false), 5000);
};

const sendTyping = socket => async () => {
  const room_id = SocketManager.getRoomIdBySocket(socket);
  const sockets = SocketManager.getSocketsByRoomId(room_id);

  sockets
    .filter(s => s.id !== socket.id)
    .forEach(s => manageTyping(s, room_id));
};

export default sendTyping;
