import Room from '../../schemas/room';

const getBy = data => Room
  .find(data)
  .then(rooms => rooms && rooms.map(r => r.toObject()));

export default getBy;
