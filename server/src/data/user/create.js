import User from '../../schemas/user';

const create = data => User
  .create(data)
  .then(user => user.toObject());

export default create;
