import Room from '../data/room';
import SocketManager from '../utils/SocketManager';
import formatRoom from '../utils/formatRoom';

const getRooms = socket => async (data) => {
  console.log('[EVENT] on get_rooms', data);

  const rooms = await Room.getByUserId(socket.user._id);

  const formatedRooms = await Promise.all(rooms.map(formatRoom));

  SocketManager
    .getSocketsByUserId(socket.user._id)
    .forEach(s => s.emit('get_rooms', formatedRooms));
};

export default getRooms;
