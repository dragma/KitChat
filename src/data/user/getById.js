import User from '../../schemas/user';

const getById = id => User
  .findById(id)
  .then(user => user && user.toObject());

export default getById;
