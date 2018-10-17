import Room from '../data/room';
import formatUser from '../utils/formatUser';
import findRooms from '../utils/findRooms';

const setLastRead = (io, socket, webhook) => async (data = {}) => {
  console.log('[DATA] for set_last_read :', data);
  const room_id = (data && data.room_id) || findRooms(io, socket, 'room')
    .map(roomId => roomId.split('room:')[1])[0];

  const room = await Room.getById(room_id);
  if (!room.last_read_at) {
    room.last_read_at = {};
  }
  const roomData = {
    last_read_at: {
      ...room.last_read_at,
      [socket.user._id]: new Date(),
    },
  };

  Room.update(room_id, roomData)
    .then(() => {
      io.to(socket.user._id).emit('set_last_read');
    });

  io.to(`user:${socket.user._id}`).emit('set_last_read');

  if (webhook && typeof webhook === 'function') {
    webhook({
      user: formatUser(socket.user, io, socket),
      room_id,
    });
  }
};

export default setLastRead;
