import Socket from '../data/socket';

function findSocketRoom(socket) {
  return Socket.getRoomId(socket.id)
    .then((room_id) => {
      if (!room_id) {
        return null;
      }
      return room_id;
    });
}

export default findSocketRoom;
