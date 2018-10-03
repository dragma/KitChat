import User from '../../schemas/user';
import getById from './getById';

const create = (id, data) => User
  .findOneAndUpdate({ _id: id }, data)
  .then(async () => {
    const user = await getById(id);
    return user;
  });

export default create;
