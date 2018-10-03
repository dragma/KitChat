import Message from '../../schemas/message';

const getByIds = ids => Message
  .find({ _id: ids })
  .then(messages => messages && messages.map(m => m.toObject()));

export default getByIds;
