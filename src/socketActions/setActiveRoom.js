import SocketManager from '../utils/SocketManager';

const setActiveRoom = socket => async (data) => {
  console.log('[EVENT] on set_active_room', data);
  SocketManager.setActiveRoom(socket, data.room_id);
  socket.emit('set_active_room');
};

export default setActiveRoom;
