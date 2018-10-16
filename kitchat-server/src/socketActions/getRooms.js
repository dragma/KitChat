import Room from '../data/room';
import SocketManager from '../utils/SocketManager';
import formatRoom from '../utils/formatRoom';
import formatUser from '../utils/formatUser';
import CustomRoomsGettersManager from '../utils/CustomRoomsGettersManager';

const getRooms = (socket, webhook) => async () => {
  const rooms = await Room
    .getByUserId(socket.user._id)
    .then(rms => rms.filter(r => r.messages && r.messages.length))
    .then(rms => Promise.all(rms.map(r => formatRoom(r, socket.user._id, { nb_messages: 1 }))));

  if (CustomRoomsGettersManager.hasGetters(socket.user.role)) {
    const specialRooms = await CustomRoomsGettersManager.getBySocket(socket);
    rooms.push(...specialRooms);
    rooms.reduce((acc, room) => {
      if (acc.map(r => r.room_id).indexOf(room.room_id) === -1) {
        acc.push(room);
      }
      return acc;
    }, []);
  }

  SocketManager
    .getSocketsByUserId(socket.user._id)
    .forEach((s) => {
      console.log('[SEND] get_rooms to socket :', s.id);
      s.emit('get_rooms', rooms);
    });

  if (webhook && typeof webhook === 'function') {
    webhook({
      user: formatUser(socket.user),
      rooms,
    });
  }
};

export default getRooms;
