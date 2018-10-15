import Room from '../../schemas/room';
import getById from './getById';

const create = (id, data) => Room
  .findOneAndUpdate({ _id: id }, data)
  .then(() => getById(id));

export default create;
