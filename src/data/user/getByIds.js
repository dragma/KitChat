import User from '../../schemas/user';

const getByIds = ids => User
  .find({ _id: ids })
  .then(users => users && users.map(u => u.toObject()));

export default getByIds;
