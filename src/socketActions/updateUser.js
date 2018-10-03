import User from '../data/user';
import formatUser from '../utils/formatUser';

const updateUser = socket => async (data) => {
  console.log('[EVENT] on update_user', data);
  const user = await User.update(socket.user._id, data);
  socket.emit('user_updated', formatUser(user));
};

export default updateUser;
