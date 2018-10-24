import User from '../data/user';
import getUser from './getUser';
import formatUser from '../utils/formatUser';
import log from '../utils/logger';

const updateUser = (io, socket, webhook) => async (data) => {
  log('[DATA] for update_user :', data);
  return User
    .update(socket.user._id, data)
    .then((usr) => {
      getUser(io, socket)();
      if (webhook && typeof webhook === 'function') {
        webhook({ user: formatUser(usr, socket) });
      }
      return usr;
    });
};

export default updateUser;
