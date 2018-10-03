import User from '../data/user';
import Room from '../data/room';
import SocketManager from '../utils/SocketManager';

const createRoom = socket => async (data) => {
  console.log('[EVENT] on create_room', data);
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

  const room = await Room.create(roomData);

  SocketManager.getSocketsByUserId(socket.user._id).forEach(s => s.emit('room_created', room));
};

export default createRoom;
