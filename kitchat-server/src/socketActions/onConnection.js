import getUser from './getUser';
import updateUser from './updateUser';
import createRoom from './createRoom';
import getRooms from './getRooms';
import getRoom from './getRoom';
import setActiveRoom from './setActiveRoom';
import sendTyping from './sendTyping';
import addMessage from './addMessage';
import setLastRead from './setLastRead';

import CustomRoomManager from '../utils/CustomRoomManager';
import formatUser from '../utils/formatUser';
import hasAccess from '../utils/hasAccess';
import log from '../utils/logger';


import User from '../data/user';


const onConnection = (socket, {
  io, makeHook, logger, options,
}) => {
  log('a user connected', socket.id);

  socket.join(`user:${socket.user._id}`);

  /* ON CONNECTION ACTIONS */
  CustomRoomManager
    .getCustomRoomsByEventName('connection')
    .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));

  makeHook('connection')({ user: formatUser(socket.user, socket) });
  /* ON CONNECTION ACTIONS END */

  // on is alive
  socket.on('is_alive', logger('is_alive', () => User.update(socket.user._id, { online: true })));

  // on get user
  if (hasAccess('get_user', socket.user, options.rules)) {
    CustomRoomManager
      .getCustomRoomsByEventName('get_user')
      .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));
    const hook = makeHook('get_user');
    socket.on('get_user', logger('get_user', getUser(io, socket, hook)));
  }

  // on user update
  if (hasAccess('update_user', socket.user, options.rules)) {
    CustomRoomManager
      .getCustomRoomsByEventName('update_user')
      .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));
    const hook = makeHook('update_user');
    socket.on('update_user', logger('update_user', updateUser(io, socket, hook)));
  }

  // on create room
  if (hasAccess('create_room', socket.user, options.rules)) {
    CustomRoomManager
      .getCustomRoomsByEventName('create_room')
      .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));
    const hook = makeHook('create_room');
    socket.on('create_room', logger('create_room', createRoom(io, socket, hook)));
  }

  // on get room
  if (hasAccess('get_room', socket.user, options.rules)) {
    CustomRoomManager
      .getCustomRoomsByEventName('get_room')
      .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));
    const hook = makeHook('get_room');
    socket.on('get_room', logger('get_room', getRoom(io, socket, hook)));
  }

  // on get rooms
  if (hasAccess('get_rooms', socket.user, options.rules)) {
    CustomRoomManager
      .getCustomRoomsByEventName('get_rooms')
      .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));
    const hook = makeHook('get_rooms');
    socket.on('get_rooms', logger('get_rooms', getRooms(io, socket, hook)));
  }

  // on get rooms
  if (hasAccess('set_active_room', socket.user, options.rules)) {
    CustomRoomManager
      .getCustomRoomsByEventName('set_active_room')
      .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));
    const hook = makeHook('set_active_room');
    socket.on('set_active_room', logger('set_active_room', setActiveRoom(io, socket, hook)));
  }

  // on typing
  if (hasAccess('typing', socket.user, options.rules)) {
    CustomRoomManager
      .getCustomRoomsByEventName('typing')
      .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));
    const hook = makeHook('typing');
    socket.on('typing', logger('typing', sendTyping(io, socket, hook)));
  }

  // on receive message
  if (hasAccess('add_message', socket.user, options.rules)) {
    CustomRoomManager
      .getCustomRoomsByEventName('add_message')
      .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));
    const hook = makeHook('add_message');
    socket.on('add_message', logger('add_message', addMessage(io, socket, options, hook)));
  }

  // on set last read
  if (hasAccess('set_last_read', socket.user, options.rules)) {
    CustomRoomManager
      .getCustomRoomsByEventName('set_last_read')
      .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));
    const hook = makeHook('set_last_read');
    socket.on('set_last_read', logger('set_last_read', setLastRead(io, socket, hook)));
  }

  // user disconnects
  socket.on('disconnect', logger('disconnect', () => {
    makeHook('disconnect')({ user: formatUser(socket.user, socket) });
    if (socket.current_room_id) {
      delete socket.current_room_id;
    }

    // manage online / offline
    log(`user:${socket.user._id}`);
    User
      .update(socket.user._id, { online: false })
      .then(() => {
        log('[SEND] is_alive to room :', `user:${socket.user._id}`);
        io.to(`user:${socket.user._id}`).emit('is_alive');
      });

    CustomRoomManager
      .getCustomRoomsByEventName('disconnect')
      .map(CustomRoom => CustomRoom.createRoom(socket.user._id, io, socket));
    log('a user disconnected');
    socket.disconnect(true);
  }));
};

export default onConnection;
