import Room from '../data/room';
import formatRoom from '../utils/formatRoom';
import formatUser from '../utils/formatUser';

const getRoom = (io, socket, webhook) => async (data) => {
  console.log('[DATA] for get_room :', data);
  // GET SOCKET ROOMS
  const room_id = socket.current_room_id;

  if (!room_id) {
    return;
  }

  const room = await Room.getById(room_id);

  const formatedRoom = await formatRoom(
    room,
    socket.user._id,
    io,
    socket,
    { nb_messages: data.nb_messages || 1 },
  );

  console.log('[SEND] get_room to socket :', socket.id);
  socket.emit('get_room', formatedRoom);

  if (webhook && typeof webhook === 'function') {
    webhook({
      user: formatUser(socket.user, socket),
      room: formatedRoom,
    });
  }
};

export default getRoom;
