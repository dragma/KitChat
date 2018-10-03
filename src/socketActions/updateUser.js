import User from '../data/user';
import formatUser from '../utils/formatUser';
import SocketManager from '../utils/SocketManager';

const updateUser = socket => async (data) => {
  console.log('[EVENT] on update_user', data);
  const user = await User.update(socket.user._id, data);

  SocketManager.getSocketsByUserId(socket.user._id).forEach(s => s.emit('user_updated', formatUser(user)));
};

export default updateUser;
