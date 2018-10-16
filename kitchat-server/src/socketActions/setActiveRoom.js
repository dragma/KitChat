import SocketManager from '../utils/SocketManager';
import formatUser from '../utils/formatUser';

const setActiveRoom = (socket, webhook) => async (data) => {
  console.log('[DATA] for set_active_room :', data);
  SocketManager.setActiveRoom(socket, data.room_id);
  console.log('[SEND] set_active_room to socket :', socket.id);
  socket.emit('set_active_room');

  if (webhook && typeof webhook === 'function') {
    webhook({
      user: formatUser(socket.user),
      room_id: data.room_id,
    });
  }
};

export default setActiveRoom;
