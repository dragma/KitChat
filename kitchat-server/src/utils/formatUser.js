const formatUser = (user, socket) => {
  const formatedUser = Object.assign({}, user);

  formatedUser.kitchat_user_id = user._id;
  formatedUser.role = socket.user.role;
  if (user.secondary_id) {
    formatedUser.user_id = user.secondary_id;
    delete formatedUser.secondary_id;
  }

  return {
    ...user,
    ...formatedUser,
  };
};

export default formatUser;
