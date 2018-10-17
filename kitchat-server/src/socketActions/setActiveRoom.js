import formatUser from '../utils/formatUser';
import findRooms from '../utils/findRooms';

const setActiveRoom = (io, socket, webhook) => async (data) => {
  console.log('[DATA] for set_active_room :', data);

  const rooms = findRooms(io, socket, 'room');
  if (rooms && rooms.length) {
    socket.leave(rooms[0]);
  }
  socket.join(`room:${data.room_id}`);

  console.log('[SEND] set_active_room to socket :', socket.id);
  socket.emit('set_active_room');

  if (webhook && typeof webhook === 'function') {
    webhook({
      user: formatUser(socket.user, io, socket),
      room_id: data.room_id,
    });
  }
};

export default setActiveRoom;
