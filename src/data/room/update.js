import Room from '../../schemas/room';
import getById from './getById';

const create = (id, data) => Room
  .findOneAndUpdate({ _id: id }, data)
  .then(async () => {
    const room = await getById(id);
    return room;
  });

export default create;
