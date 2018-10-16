import Room from '../data/room';
import formatRoom from './formatRoom';

class CustomRoomsGettersManager {
  constructor() {
    this.getters = {};

    this.hasGetters = this.hasGetters.bind(this);
    this.add = this.add.bind(this);
    this.getBySocket = this.getBySocket.bind(this);
  }

  add(user_role, options) {
    if (!this.getters[user_role]) {
      this.getters[user_role] = [];
    }
    options.forEach(option => this.getters[user_role].push(user => Room.getBy(option(user))));
  }

  hasGetters(user_role) {
    return !!this.getters[user_role];
  }

  async getBySocket(socket) {
    const rooms = await Promise
      .all(this.getters[socket.user.role].map(fn => fn(socket.user))) // result [[rooms], [rooms]]
      .then((rmsArray) => { // flatten to [room, room, room]
        const result = [];
        rmsArray.forEach((rms) => {
          rms.forEach(r => result.push(r));
        });
        return result;
      })
      .then(rms => rms.reduce((acc, room) => {
        if (acc.map(r => r._id).indexOf(room._id) === -1) {
          acc.push(room);
        }
        return acc;
      }, []))
      .then(rms => Promise.all(rms.map(r => formatRoom(r))));

    return rooms;
  }
}

export default new CustomRoomsGettersManager();
