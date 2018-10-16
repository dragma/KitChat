import moment from 'moment';

import User from '../data/user';
import Message from '../data/message';
import formatUser from './formatUser';
import formatMessage from './formatMessage';

const formatRoom = async (room, user_id, options = {}) => {
  const formatedRoom = Object.assign({}, room);

  formatedRoom.room_id = room._id;

  let messagesIds = [];

  if (options && options.nb_messages) {
    messagesIds = formatedRoom.messages.reverse().slice(0, options.nb_messages);
  } else {
    messagesIds = formatedRoom.messages;
  }
  const allMessagesLength = formatedRoom.messages.length;
  const messagesToLoadLength = messagesIds.length;

  const messages = await Message.getByIds(messagesIds)
    .then(msgs => Promise.all(msgs.reverse().map(msg => formatMessage(msg))));
  const users = await User.getByIds(room.users)
    .then(usrs => Promise.all(usrs.map(u => formatUser(u))));
  formatedRoom.users = users;
  formatedRoom.messages = messages;

  formatedRoom.all_messages_fetched = messagesToLoadLength === allMessagesLength;

  let read = false;
  if (!messages.length) {
    read = true;
  } else if (room.last_read_at) {
    if (room.last_read_at[user_id]) {
      const lastRead = +moment(new Date(room.last_read_at[user_id]));
      const lastMessageDate = +moment(new Date(messages[0].created_at));
      read = lastRead > lastMessageDate;
    }
  }

  formatedRoom.read = read;

  delete formatedRoom.__v;
  delete formatedRoom._id;

  return {
    ...room,
    ...formatedRoom,
  };
};

export default formatRoom;
