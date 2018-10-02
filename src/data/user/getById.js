import User from '../../schemas/user';

const getById = id => User.findById(id);

export default getById;
