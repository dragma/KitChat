import Room from '../data/room';
import SocketManager from '../utils/SocketManager';
import formatRoom from '../utils/formatRoom';

const getRooms = socket => async () => {
  const rooms = await Room
    .getByUserId(socket.user._id)
    .then(rms => rms.filter(r => r.messages && r.messages.length))
    .then(rms => Promise.all(rms.map(r => formatRoom(r, socket.user._id, { nb_messages: 1 }))));

  SocketManager
    .getSocketsByUserId(socket.user._id)
    .forEach((s) => {
      console.log('[SEND] get_rooms to socket :', s.id);
      s.emit('get_rooms', rooms);
    });
};

export default getRooms;
