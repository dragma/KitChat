const formatUser = (user, io) => {
  const formatedUser = Object.assign({}, user);

  formatedUser.kitchat_user_id = user._id;
  delete formatedUser._id;
  delete formatedUser.__v;
  if (user.secondary_id) {
    formatedUser.user_id = user.secondary_id;
    delete formatedUser.secondary_id;
  }

  if (io.sockets.adapter.rooms && io.sockets.adapter.rooms[`user:${formatedUser.kitchat_user_id}`]) {
    formatedUser.online = true;
  } else {
    formatedUser.online = false;
  }

  return {
    ...user,
    ...formatedUser,
  };
};

export default formatUser;
