import Room from '../data/room';
import SocketManager from '../utils/SocketManager';
import formatRoom from '../utils/formatRoom';

const getRooms = socket => async (data) => {
  console.log('[EVENT] on get_room', data);

  const room = await Room.getById(data.room_id);

  const formatedRoom = await formatRoom(room);

  SocketManager
    .getSocketsByUserId(socket.user._id)
    .forEach(s => s.emit('get_room', formatedRoom));
};

export default getRooms;
