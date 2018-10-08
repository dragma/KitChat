import Message from '../data/message';
import Room from '../data/room';
import formatRoom from '../utils/formatRoom';
import SocketManager from '../utils/SocketManager';


const addMessage = socket => async (data) => {
  console.log('[EVENT] on add_message', data);

  socket.emit('message_sent');

  await Message.create({
    message: data.message,
    room_id: data.room_id,
    user_id: socket.user._id,
  });

  const room = await Room.getById(data.room_id).then(rawRoom => formatRoom(rawRoom));

  SocketManager
    .getSocketsByRoomId(data.room_id)
    .forEach(s => s.emit('get_room', room));
};

export default addMessage;
