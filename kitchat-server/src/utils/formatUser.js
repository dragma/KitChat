import SocketManager from './SocketManager';

const formatUser = (user) => {
  const formatedUser = Object.assign({}, user);

  formatedUser.kitchat_user_id = user._id;
  delete formatedUser._id;
  delete formatedUser.__v;
  if (user.secondary_id) {
    formatedUser.user_id = user.secondary_id;
    delete formatedUser.secondary_id;
  }

  const online = !!SocketManager.getSocketsByUserId(formatedUser.kitchat_user_id).length;

  formatedUser.online = online;

  return {
    ...user,
    ...formatedUser,
  };
};

export default formatUser;
