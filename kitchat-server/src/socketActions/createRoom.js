import User from '../data/user';
import Room from '../data/room';
import SocketManager from '../utils/SocketManager';
import formatRoom from '../utils/formatRoom';
import formatUser from '../utils/formatUser';


const createRoom = (socket, webhook) => async (data) => {
  console.log('[DATA] for create_room :', data);
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

  const formatedNewRoom = await formatRoom(newRoom);

  if (!rooms.length) {
    if (webhook && typeof webhook === 'function') {
      webhook({
        user: formatUser(socket.user),
        room: formatedNewRoom,
      });
    }
  }

  SocketManager
    .getSocketsByUserIds(newRoom.users)
    .forEach(async (s) => {
      console.log('[SEND] room_created to socket :', s.id);
      s.emit('room_created', formatedNewRoom);
    });
};

export default createRoom;
