import Room from '../data/room';
import SocketManager from '../utils/SocketManager';
import formatRoom from '../utils/formatRoom';

const getRooms = socket => async (data) => {
  console.log('[DATA] for get_room :', data);
  const room_id = SocketManager.getRoomIdBySocket(socket);

  const room = await Room.getById(room_id);

  const formatedRoom = await formatRoom(
    room,
    socket.user._id,
    { nb_messages: data.nb_messages || 1 },
  );

  console.log('[SEND] get_room to socket :', socket.id);
  socket.emit('get_room', formatedRoom);
};

export default getRooms;
