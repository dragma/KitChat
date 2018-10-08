class SocketManager {
  constructor() {
    this.sockets = {};
    this.users = {};

    this.socketsByRoom = {};
    this.roomBySocket = {};

    this._saveSocket = this._saveSocket.bind(this);
    this._deleteSocket = this._deleteSocket.bind(this);
    this._registerUser = this._registerUser.bind(this);
    this._unregisterUser = this._unregisterUser.bind(this);
    this._registerActiveRoom = this._registerActiveRoom.bind(this);
    this._unregisterActiveRoom = this._unregisterActiveRoom.bind(this);
  }

  _saveSocket(socket) {
    this.sockets[socket.id] = socket;
  }

  _deleteSocket(socket) {
    if (this.sockets[socket.id]) {
      delete this.sockets[socket.id];
    }
  }

  _registerUser(socket) {
    if (!this.users[socket.user._id]) {
      this.users[socket.user._id] = [];
    }
    this.users[socket.user._id].push(socket.id);
  }

  _unregisterUser(socket) {
    if (socket.user) {
      // check users if socket exists
      if (this.users[socket.user._id]) {
        this.users[socket.user._id] = this.users[socket.user._id]
          .filter(id => socket.id !== id);
      }
      if (!this.users[socket.user._id].length) {
        delete this.users[socket.user._id];
      }
    }
  }

  _registerActiveRoom(socket, roomId) {
    // if a link socket => roomId already exists
    if (this.roomBySocket[socket.id]) {
      // if the rooms ids are different
      if (this.roomBySocket[socket.id] !== roomId) {
        // unregister previous room
        this._unregisterActiveRoom(socket, this.roomBySocket[socket.id]);
      }
    }
    if (!this.socketsByRoom[roomId]) {
      this.socketsByRoom[roomId] = [];
    }
    this.socketsByRoom[roomId].push(socket.id);
    this.roomBySocket[socket.id] = roomId;
  }

  _unregisterActiveRoom(socket, roomId) {
    if (this.roomBySocket[socket.id]) {
      delete this.roomBySocket[socket.id];
    }

    if (this.socketsByRoom[roomId]) {
      this.socketsByRoom[roomId] = this.socketsByRoom[roomId].filter(id => id !== socket.id);

      if (!this.socketsByRoom[roomId].length) {
        delete this.socketsByRoom[roomId];
      }
    }
  }

  addSocket(socket) {
    if (socket.user) {
      this._saveSocket(socket);
      this._registerUser(socket);
    } else {
      console.warn('[ERROR] Socket does not contains user.');
    }
    return this;
  }

  deleteSocket(socket) {
    this._unregisterActiveRoom(socket, this.getRoomIdBySocket(socket));
    this._unregisterUser(socket);
    this._deleteSocket(socket);
    return this;
  }

  getSocketsByUserId(userId) {
    const socketsIds = this.users[userId];
    return socketsIds.map(id => this.sockets[id]);
  }

  getSocketsByUserIds(ids) {
    if (!ids || !Array.isArray(ids)) {
      return [];
    }
    return ids.map(id => this.getSocketsByUserId(id))
      .reduce((acc, sockets) => [...acc, ...sockets], []);
  }

  getUsersSocketsBySocket(socket) {
    return this.getSocketsByUserId(socket.user._id);
  }

  getSocketsByRoomId(roomId) {
    if (!this.socketsByRoom[roomId]) {
      return [];
    }
    return this.socketsByRoom[roomId];
  }

  getRoomIdBySocket(socket) {
    return this.roomBySocket[socket.id];
  }

  setActiveRoom(socket, roomId) {
    this._registerActiveRoom(socket, roomId);
    console.log('NEW ROOM SET');
    console.log(this.socketsByRoom);
    console.log(this.roomBySocket);
    return this;
  }
}

export default new SocketManager();
