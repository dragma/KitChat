import Message from '../data/message';
import Room from '../data/room';
import formatRoom from '../utils/formatRoom';
import SocketManager from '../utils/SocketManager';
import setLastRead from './setLastRead';
import getRooms from './getRooms';


const addMessage = socket => async (data) => {
  console.log('[EVENT] on add_message', data);

  socket.emit('message_sent');

  await Message.create({
    message: data.message,
    room_id: data.room_id,
    user_id: socket.user._id,
  });

  const room = await Room
    .getById(data.room_id)
    .then(rawRoom => formatRoom(rawRoom, socket.user._id));

  SocketManager
    .getSocketsByRoomId(data.room_id)
    .forEach(s => s.emit('get_room', room));

  const userIds = room.users.map(u => u.kitchat_user_id);

  SocketManager
    .getSocketsByUserIds(userIds)
    .forEach(s => getRooms(s)());

  setLastRead(socket)({ room_id: data.room_id });
};

export default addMessage;
