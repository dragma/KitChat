import User from '../data/user';
import formatUser from '../utils/formatUser';
import SocketManager from '../utils/SocketManager';

const getUser = (socket, webhook) => async () => {
  const user = await User.getById(socket.user._id);

  SocketManager.getSocketsByUserId(socket.user._id).forEach((s) => {
    console.log('[SEND] get_user to socket :', s.id);
    s.emit('get_user', formatUser(user));
  });

  if (webhook && typeof webhook === 'function') {
    webhook({
      on: 'get_user',
      user: formatUser(socket.user),
    });
  }
};

export default getUser;
