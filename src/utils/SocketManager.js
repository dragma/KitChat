class SocketManager {
  constructor() {
    this.users = {};
  }

  addSocket(socket) {
    if (socket.user) {
      if (!this.users[socket.user._id]) {
        this.users[socket.user._id] = {};
      }
      this.users[socket.user._id] = {
        ...this.users[socket.user._id],
        [socket.id]: socket,
      };
    } else {
      console.warn('[ERROR] Socket does not contains user.');
    }
    return this;
  }

  deleteSocket(socket) {
    if (socket.user) {
      if (this.users[socket.user._id]) {
        if (this.users[socket.user._id][socket.id]) {
          delete this.users[socket.user._id][socket.id];
        }
        if (!Object.keys(this.users[socket.user._id]).length) {
          delete this.users[socket.user._id];
        }
      }
    } else {
      console.warn('[ERROR] Socket does not contains user.');
    }
    return this;
  }

  getSocketsByUserId(userId) {
    if (this.users[userId]) {
      return Object.values(this.users[userId]);
    }
    return [];
  }

  getSocketsByUserIds(ids) {
    if (!ids || !Array.isArray(ids)) {
      return [];
    }
    return ids.map(id => this.getSocketsByUserId(id))
      .reduce((acc, sockets) => [...acc, ...sockets], []);
  }

  getUsersSocketsBySocket(socket) {
    if (this.users[socket.user._id]) {
      return Object.values(this.users[socket.user._id]);
    }
    return [];
  }
}

export default new SocketManager();
