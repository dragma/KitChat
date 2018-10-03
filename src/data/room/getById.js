import Room from '../../schemas/room';

const getById = id => Room
  .findById(id)
  .then(room => room && room.toObject());

export default getById;
