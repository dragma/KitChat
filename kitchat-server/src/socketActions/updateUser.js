import User from '../data/user';
import getUser from './getUser';
import formatUser from '../utils/formatUser';

const updateUser = (socket, webhook) => async (data) => {
  console.log('[DATA] for update_user :', data);
  return User
    .update(socket.user._id, data)
    .then((usr) => {
      getUser(socket)();
      if (webhook && typeof webhook === 'function') {
        webhook({ user: formatUser(usr) });
      }
      return usr;
    });
};

export default updateUser;
