import User from '../data/user';
import formatUser from '../utils/formatUser';
import log from '../utils/logger';


const getUser = (io, socket, webhook) => async () => {
  const user = await User.getById(socket.user._id);

  log('[SEND] get_user to room :', `user:${socket.user._id}`);
  io.to(`user:${socket.user._id}`).emit('get_user', formatUser(user, socket));

  if (webhook && typeof webhook === 'function') {
    webhook({
      on: 'get_user',
      user: formatUser(socket.user, socket),
    });
  }
};

export default getUser;
