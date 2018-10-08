import User from '../data/user';
import Message from '../data/message';
import formatUser from './formatUser';
import formatMessage from './formatMessage';

const formatRoom = async (room) => {
  const formatedRoom = Object.assign(room);

  formatedRoom.room_id = room._id;

  const messages = await Message.getByIds(formatedRoom.messages)
    .then(msgs => Promise.all(msgs.map(msg => formatMessage(msg))));
  const users = await User.getByIds(room.users)
    .then(usrs => Promise.all(usrs.map(u => formatUser(u))));
  formatedRoom.users = users;
  formatedRoom.messages = messages;

  delete room.__v;
  delete room._id;

  return {
    ...room,
    ...formatedRoom,
  };
};

export default formatRoom;
