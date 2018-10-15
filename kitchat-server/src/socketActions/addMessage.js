import truncate from 'lodash.truncate';

import Message from '../data/message';
import Room from '../data/room';
import SocketManager from '../utils/SocketManager';
import setLastRead from './setLastRead';
import getRooms from './getRooms';

const addMessage = (socket, options) => async (data) => {
  console.log('[DATA] for add_message :', data);
  const room_id = SocketManager.getRoomIdBySocket(socket);

  await Message.create({
    message: truncate(data.message, options.max_message_size),
    room_id,
    user_id: socket.user._id,
  }).then(() => {
    console.log('[SEND] message_sent to socket :', socket.id);
    socket.emit('message_sent');
  });

  SocketManager
    .getSocketsByRoomId(room_id)
    .forEach(s => s.emit('message_received'));

  const userIds = await Room
    .getById(room_id)
    .then(room => room.users);

  setLastRead(socket)({ room_id });

  SocketManager
    .getSocketsByUserIds(userIds)
    .forEach((s) => {
      console.log('Message created by socket :', socket.id);
      getRooms(s)();
    });
};

export default addMessage;
