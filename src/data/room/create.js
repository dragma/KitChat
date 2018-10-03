import Room from '../../schemas/room';

const create = data => Room
  .create(data)
  .then(room => room.toObject());

export default create;
