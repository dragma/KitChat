import User from '../data/user';
import formatUser from './formatUser';

const formatRoom = async (room) => {
  const formatedRoom = Object.assign(room);

  formatedRoom.room_id = room._id;
  formatedRoom.user_ids = room.users;
  delete room.users;
  delete room.__v;
  delete room._id;

  const users = await User.getByIds(formatedRoom.user_ids);
  formatedRoom.users = users.map(u => formatUser(u));
  delete room.user_ids;

  return {
    ...room,
    ...formatedRoom,
  };
};

export default formatRoom;
