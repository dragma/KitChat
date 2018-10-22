import formatUser from '../utils/formatUser';

const timeouts = {};

const manageTyping = (socket, room_id) => {
  console.log('[SEND] typing true to room :', room_id);
  socket.broadcast.to(room_id).emit('typing', true);
  if (timeouts[room_id]) {
    clearTimeout(timeouts[room_id]);
  }

  timeouts[room_id] = setTimeout(() => {
    console.log('[SEND] typing false to room :', room_id);
    socket.broadcast.to(room_id).emit('typing', false);
  }, 3000);
};

const sendTyping = (io, socket, webhook) => async () => {
  const room_id = socket.current_room_id;

  if (!room_id) {
    return;
  }

  manageTyping(socket, room_id);

  if (webhook && typeof webhook === 'function') {
    webhook({
      user: formatUser(socket.user, socket),
      room_id,
    });
  }
};

export default sendTyping;
