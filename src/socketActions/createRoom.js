import User from '../data/user';
import Room from '../data/room';
import SocketManager from '../utils/SocketManager';

const createRoom = socket => async (data) => {
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

  SocketManager
    .getSocketsByUserIds(newRoom.users)
    .forEach((s) => {
      console.log('[SEND] room_created to socket :', s.id);
      s.emit('room_created', newRoom);
    });
};

export default createRoom;
