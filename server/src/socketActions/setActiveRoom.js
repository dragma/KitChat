import SocketManager from '../utils/SocketManager';

const setActiveRoom = socket => async (data) => {
  console.log('[DATA] for set_active_room :', data);
  SocketManager.setActiveRoom(socket, data.room_id);
  console.log('[SEND] set_active_room to socket :', socket.id);
  socket.emit('set_active_room');
};

export default setActiveRoom;
