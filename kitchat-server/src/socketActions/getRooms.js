import uniqby from 'lodash.uniqby';
import Room from '../data/room';
import formatRoom from '../utils/formatRoom';
import formatUser from '../utils/formatUser';
import CustomRoomsGettersManager from '../utils/CustomRoomsGettersManager';

const getRooms = (io, socket, webhook) => async () => {
  let rooms = await Room
    .getByUserId(socket.user._id)
    .then(rms => rms.filter(r => r.messages && r.messages.length))
    .then(rms => Promise.all(
      rms.map(r => formatRoom(r, socket.user._id, io, socket, { nb_messages: 1 })),
    ));

  if (CustomRoomsGettersManager.hasGetters(socket.user.role)) {
    const specialRooms = await CustomRoomsGettersManager.getBySocket(socket);
    rooms.push(...specialRooms);
    rooms = uniqby(rooms, room => room.room_id.toString());
  }

  console.log('[SEND] get_rooms to room :', `user:${socket.user._id}`);
  io.to(`user:${socket.user._id}`).emit('get_rooms', rooms);

  if (webhook && typeof webhook === 'function') {
    webhook({
      user: formatUser(socket.user, io, socket),
      rooms,
    });
  }
};

export default getRooms;
