import User from '../data/user';
import formatUser from './formatUser';

const formatMessage = async (message, io, socket) => {
  const formatedMessage = Object.assign({}, message);

  formatedMessage.message_id = message._id;
  formatedMessage.user_id = message.user;
  formatedMessage.room_id = message.room;
  delete formatedMessage.__v;
  delete formatedMessage._id;

  if (formatedMessage.user_id) {
    const user = await User.getById(formatedMessage.user_id).then(u => formatUser(u, socket));
    formatedMessage.user = user;
    delete formatedMessage.user_id;
  }

  return {
    ...message,
    ...formatedMessage,
  };
};

export default formatMessage;
