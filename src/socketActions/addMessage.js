import truncate from 'lodash.truncate';

import Message from '../data/message';
import Room from '../data/room';
import formatRoom from '../utils/formatRoom';
import SocketManager from '../utils/SocketManager';
import setLastRead from './setLastRead';
import getRooms from './getRooms';
import { MAX_MESSAGE_SIZE } from '../config';


const addMessage = socket => async (data) => {
  console.log('[DATA] for add_message :', data);

  await Message.create({
    message: truncate(data.message, MAX_MESSAGE_SIZE),
    room_id: data.room_id,
    user_id: socket.user._id,
  }).then(() => {
    console.log('[SEND] message_sent to socket :', socket.id);
    socket.emit('message_sent');
  });

  const room = await Room
    .getById(data.room_id)
    .then(rawRoom => formatRoom(rawRoom, socket.user._id));

  SocketManager
    .getSocketsByRoomId(data.room_id)
    .forEach(s => s.emit('get_room', room));

  const userIds = room.users.map(u => u.kitchat_user_id);

  setLastRead(socket)({ room_id: data.room_id });

  SocketManager
    .getSocketsByUserIds(userIds)
    .forEach((s) => {
      console.log('Message created by socket :', socket.id);
      getRooms(s)();
    });
};

export default addMessage;
