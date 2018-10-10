import User from '../data/user';
import getUser from './getUser';

const updateUser = socket => (data) => {
  console.log('[DATA] for update_user :', data);
  return User.update(socket.user._id, data).then(getUser(socket));
};

export default updateUser;
