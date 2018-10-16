import truncate from 'lodash.truncate';

import Message from '../data/message';
import Room from '../data/room';
import SocketManager from '../utils/SocketManager';
import setLastRead from './setLastRead';
import getRooms from './getRooms';
import formatMessage from '../utils/formatMessage';
import formatUser from '../utils/formatUser';

const addMessage = (socket, options, webhook) => async (data) => {
  console.log('[DATA] for add_message :', data);
  const room_id = SocketManager.getRoomIdBySocket(socket);

  const message = await Message.create({
    message: truncate(data.message, options.max_message_size),
    room_id,
    user_id: socket.user._id,
  }).then((msg) => {
    console.log('[SEND] message_sent to socket :', socket.id);
    socket.emit('message_sent');
    return formatMessage(msg);
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

  if (webhook && typeof webhook === 'function') {
    webhook({
      on: 'add_message',
      user: formatUser(socket.user),
      message,
      room_id,
    });
  }
};

export default addMessage;
