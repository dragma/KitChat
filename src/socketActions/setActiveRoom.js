import SocketManager from '../utils/SocketManager';
import getRoom from './getRoom';

const updateUser = socket => async (data) => {
  SocketManager.setActiveRoom(socket, data.room_id);
  getRoom(socket)({ room_id: data.room_id });
};

export default updateUser;
