import User from '../data/user';
import getUser from './getUser';
import formatUser from '../utils/formatUser';

const updateUser = (io, socket, webhook) => async (data) => {
  console.log('[DATA] for update_user :', data);
  return User
    .update(socket.user._id, data)
    .then((usr) => {
      getUser(io, socket)();
      if (webhook && typeof webhook === 'function') {
        webhook({ user: formatUser(usr, io, socket) });
      }
      return usr;
    });
};

export default updateUser;
