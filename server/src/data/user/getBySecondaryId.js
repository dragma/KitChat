import User from '../../schemas/user';

const getBySecondaryId = id => User
  .findOne({ secondary_id: id })
  .then(user => user && user.toObject());

export default getBySecondaryId;
