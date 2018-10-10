import Room from '../data/room';
import getRooms from './getRooms';
import SocketManager from '../utils/SocketManager';

const setLastRead = socket => async (data) => {
  console.log('[DATA] for set_last_read :', data);
  const room_id = data.room_id || SocketManager.getRoomIdBySocket(socket);
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

  Room.update(room_id, roomData).then(() => SocketManager
    .getUsersSocketsBySocket(socket)
    .forEach(s => getRooms(s)()));
};

export default setLastRead;
