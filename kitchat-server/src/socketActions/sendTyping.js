import SocketManager from '../utils/SocketManager';
import formatUser from '../utils/formatUser';

const timeouts = {};

const manageTyping = (socket) => {
  console.log('[SEND] typing true to socket', socket.id);
  socket.emit('typing', true);
  if (timeouts[socket.id]) {
    clearTimeout(timeouts[socket.id]);
  }

  timeouts[socket.id] = setTimeout(() => {
    console.log('[SEND] typing false to socket', socket.id);
    socket.emit('typing', false);
  }, 3000);
};

const sendTyping = (socket, webhook) => async () => {
  const room_id = SocketManager.getRoomIdBySocket(socket);
  const sockets = SocketManager.getSocketsByRoomId(room_id);

  sockets
    .filter(s => s.user._id !== socket.user._id)
    .forEach(s => manageTyping(s));

  if (webhook && typeof webhook === 'function') {
    webhook({
      user: formatUser(socket.user),
      room_id,
    });
  }
};

export default sendTyping;
