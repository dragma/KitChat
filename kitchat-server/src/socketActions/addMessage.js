import truncate from 'lodash.truncate';

import Message from '../data/message';
import Room from '../data/room';
import setLastRead from './setLastRead';
import formatMessage from '../utils/formatMessage';
import formatUser from '../utils/formatUser';

const addMessage = (io, socket, options, webhook) => async (data) => {
  console.log('[DATA] for add_message :', data);

  const room_id = socket.current_room_id;

  const message = await Message.create({
    message: truncate(data.message, options.max_message_size),
    room_id,
    user_id: socket.user._id,
  }).then((msg) => {
    console.log('[SEND] message_sent to socket :', socket.id);
    socket.emit('message_sent');
    return formatMessage(msg, io, socket);
  });

  console.log('[SEND] message_received to room :', `room:${room_id}`);
  io.to(`room:${room_id}`).emit('message_received');


  console.log('[SEND] message_received to room :', `room:${room_id}`);
  io.to(`room:${room_id}`).emit('typing', false);
  setLastRead(io, socket)({ room_id });

  const userIds = await Room
    .getById(room_id)
    .then(room => room.users);

  userIds.forEach((userId) => {
    console.log('[SEND] refetch_rooms to room :', `user:${userId}`);
    io.to(`user:${userId}`).emit('refetch_rooms');
  });

  if (webhook && typeof webhook === 'function') {
    webhook({
      on: 'add_message',
      user: formatUser(socket.user, socket),
      message,
      room_id,
    });
  }
};

export default addMessage;
