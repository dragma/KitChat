import log from './logger';
import User from '../data/user';
import Room from '../data/room';
import Message from '../data/message';
import formatUser from './formatUser';
import formatRoom from './formatRoom';

class CustomRoom {
  constructor({
    create_on,
    create_if,
    room_data,
    first_message,
  }) {
    this.create_on = create_on;
    this.create_if = create_if;
    this.room_data = room_data;
    this.build_first_message = first_message;

    this._shallCreate = this._shallCreate.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  _shallCreate(user, rooms) {
    return this.create_if(user, rooms);
  }

  async createRoom(user_id, io, socket) {
    const user = await User.getById(user_id)
      .then(usr => formatUser(usr, socket));
    const rooms = await Room.getByUserId(user_id)
      .then(rms => Promise.all(rms.map(r => formatRoom(r, user_id, io, socket))));

    const test = this._shallCreate(user, rooms);

    if (!test) {
      return false;
    }
    const roomData = this.room_data(user, rooms);
    const room = await Room.create(roomData).then((r) => {
      log('[CUSTOM ROOM] custom room created with data :', JSON.stringify(roomData));
      return r;
    });
    if (this.build_first_message) {
      const messageData = {
        ...this.build_first_message(user),
        room_id: room._id,
      };
      await Message.create(messageData);
      log('[CUSTOM ROOM] first message inserted with data :', JSON.stringify(messageData));
    }
    return true;
  }
}

class CustomRoomManager {
  constructor() {
    this.custom_rooms = {};
  }

  addCustomRoom(custom_room_config, io, socket) {
    if (!this.custom_rooms[custom_room_config.create_on]) {
      this.custom_rooms[custom_room_config.create_on] = [];
    }
    this.custom_rooms[custom_room_config.create_on].push(new CustomRoom({
      ...custom_room_config,
      io,
      socket,
    }));
  }

  getCustomRoomsByEventName(event_name) {
    return this.custom_rooms[event_name] || [];
  }
}

export default new CustomRoomManager();
