const formatUser = (user) => {
  const formatedUser = Object.assign(user);

  formatedUser.kitchat_user_id = user._id;
  delete user._id;
  delete user.__v;
  if (user.secondary_id) {
    formatedUser.user_id = user.secondary_id;
    delete user.secondary_id;
  }

  return {
    ...user,
    ...formatedUser,
  };
};

export default formatUser;
