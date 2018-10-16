import Room from '../data/room';
import SocketManager from '../utils/SocketManager';
import formatRoom from '../utils/formatRoom';
import formatUser from '../utils/formatUser';

const getRooms = (socket, webhook) => async () => {
  const rooms = await Room
    .getByUserId(socket.user._id)
    .then((rms) => {
      console.log('AFTER THEN', rms.map(rm => rm.custom_flags));
      return rms;
    })
    .then(rms => rms.filter(r => r.messages && r.messages.length))
    .then((rms) => {
      console.log('AFTER THEN', rms.map(rm => rm.custom_flags));
      return rms;
    })
    .then(rms => Promise.all(rms.map(r => formatRoom(r, socket.user._id, { nb_messages: 1 }))));


  SocketManager
    .getSocketsByUserId(socket.user._id)
    .forEach((s) => {
      console.log('[SEND] get_rooms to socket :', s.id);
      s.emit('get_rooms', rooms);
    });

  console.log('ROOMS', rooms);

  if (webhook && typeof webhook === 'function') {
    webhook({
      user: formatUser(socket.user),
      rooms,
    });
  }
};

export default getRooms;
