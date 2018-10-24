import User from '../data/user';
import Room from '../data/room';
import formatRoom from '../utils/formatRoom';
import formatUser from '../utils/formatUser';
import log from '../utils/logger';


const createRoom = (io, socket, webhook) => async (data) => {
  log('[DATA] for create_room :', data);
  const roomData = {
    users: [],
  };

  roomData.users.push(socket.user._id);

  if (data.user_id) {
    const user = await User.getBySecondaryId(data.user_id);
    if (user) {
      roomData.users.push(user._id);
    }
  }

  const rooms = await Room.getByUserId(roomData.users);

  let newRoom = null;
  if (!rooms.length) {
    newRoom = await Room.create(roomData);
  } else {
    [newRoom] = rooms;
  }

  const formatedNewRoom = await formatRoom(newRoom, socket.user._id, io, socket);

  if (!rooms.length) {
    if (webhook && typeof webhook === 'function') {
      webhook({
        user: formatUser(socket.user, socket),
        room: formatedNewRoom,
      });
    }
  }

  log('[SEND] room_created to room :', `user:${socket.user._id}`);
  io.to(`user:${socket.user._id}`).emit('room_created', formatedNewRoom);
};

export default createRoom;
