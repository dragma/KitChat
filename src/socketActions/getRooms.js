import Room from '../data/room';
import SocketManager from '../utils/SocketManager';
import formatRoom from '../utils/formatRoom';

const getRooms = socket => async (data) => {
  console.log('[EVENT] on get_rooms', data);

  const rooms = await Room
    .getByUserId(socket.user._id)
    .then(rms => Promise.all(rms.map(r => formatRoom(r, socket.user._id, { nb_messages: 1 }))));

  SocketManager
    .getSocketsByUserId(socket.user._id)
    .forEach(s => s.emit('get_rooms', rooms));
};

export default getRooms;
