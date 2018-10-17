function findRooms(io, socket, type) {
  const returnedRooms = [];
  const { rooms } = io.sockets.adapter;

  const roomsIds = Object.keys(rooms)
    .filter(roomId => roomId.split(`${type}:`).length > 1);

  for (let i = 0; i < roomsIds.length; i += 1) {
    const roomId = roomsIds[i];
    if (roomId !== socket.id) {
      const room = rooms[roomId];
      if (room.sockets && room.sockets[socket.id]) {
        returnedRooms.push(roomId);
      }
    }
  }
  return returnedRooms;
}

export default findRooms;
