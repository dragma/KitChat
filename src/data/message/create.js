import Room from '../room';
import Message from '../../schemas/message';

const create = async (data) => {
  const messageData = {
    room: data.room_id,
    user: data.user_id,
    message: data.message,
  };
  const message = await Message.create(messageData);
  await Room.update(data.room_id, { $push: { messages: message._id } });
  return message;
};

export default create;
