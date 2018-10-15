import Room from '../../schemas/room';

const getByUserId = userId => Room
  .find({ users: userId })
  .then(rooms => rooms && rooms.map(r => r.toObject()));

export default getByUserId;
