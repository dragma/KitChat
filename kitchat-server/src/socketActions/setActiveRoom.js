import formatUser from '../utils/formatUser';

const setActiveRoom = (io, socket, webhook) => async (data) => {
  console.log('[DATA] for set_active_room :', data);

  const roomId = socket.current_room_id;

  if (roomId) {
    socket.leave(`room:${roomId}`);
  }
  socket.join(`room:${data.room_id}`);
  socket.current_room_id = data.room_id;

  console.log('[SEND] set_active_room to socket :', socket.id);
  socket.emit('set_active_room');

  if (webhook && typeof webhook === 'function') {
    webhook({
      user: formatUser(socket.user, socket),
      room_id: data.room_id,
    });
  }
};

export default setActiveRoom;
