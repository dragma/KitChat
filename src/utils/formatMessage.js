import User from '../data/user';
import formatUser from './formatUser';

const formatRoom = async (message) => {
  const formatedMessage = Object.assign(message);

  formatedMessage.message_id = message._id;
  formatedMessage.user_id = message.user;
  delete message.user;
  delete message.__v;
  delete message._id;

  const user = await User.getById(formatedMessage.user_id).then(u => formatUser(u));
  formatedMessage.user = user;
  delete message.user_id;

  return {
    ...message,
    ...formatedMessage,
  };
};

export default formatRoom;
