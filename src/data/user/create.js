import User from '../../schemas/user';

const create = data => User.create(data);

export default create;
