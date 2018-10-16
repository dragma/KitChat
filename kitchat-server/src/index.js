import mongoose from 'mongoose';
import bluebird from 'bluebird';
import socketIo from 'socket.io';

import { MAX_MESSAGE_SIZE, MONGO_URI, JWT_SECRET } from './config';

import auth from './socketActions/auth';
import getUser from './socketActions/getUser';
import updateUser from './socketActions/updateUser';
import createRoom from './socketActions/createRoom';
import getRooms from './socketActions/getRooms';
import getRoom from './socketActions/getRoom';
import setActiveRoom from './socketActions/setActiveRoom';
import sendTyping from './socketActions/sendTyping';
import addMessage from './socketActions/addMessage';
import setLastRead from './socketActions/setLastRead';

import formatUser from './utils/formatUser';
import SocketManager from './utils/SocketManager';
import webhook from './utils/webhook';
import hasAccess from './utils/hasAccess';

// default options
const defaultOptions = {
  max_message_size: MAX_MESSAGE_SIZE,
  mongo_uri: MONGO_URI,
  jwt_secret: JWT_SECRET,
  rules: {},
  webhooks: {},
};

// mogoose setup
mongoose.Promise = bluebird;

const connectMongo = (mongo_uri) => {
  mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
  });
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error'));
  db.once('open', () => console.log('[INFO] Connected to Mongo'));
};


// Server & socket.io setup
const createChatServer = (server, userOptions) => {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  connectMongo(options.mongo_uri);

  const makeHook = webhook(options.webhooks, options.jwt_secret);

  const io = socketIo(server);

  io.use(auth(options.jwt_secret));

  const logger = (name, action) => (data) => {
    console.log('[EVENT] on', name);
    return action(data);
  };

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    SocketManager.addSocket(socket);

    makeHook('connection')({ user: formatUser(socket.user) });

    // on get user
    if (hasAccess('get_user', socket.user, options.rules)) {
      const hook = makeHook('get_user');
      socket.on('get_user', logger('get_user', getUser(socket, hook)));
    }

    // on user update
    if (hasAccess('update_user', socket.user, options.rules)) {
      const hook = makeHook('update_user');
      socket.on('update_user', logger('update_user', updateUser(socket, hook)));
    }

    // on create room
    if (hasAccess('create_room', socket.user, options.rules)) {
      const hook = makeHook('create_room');
      socket.on('create_room', logger('create_room', createRoom(socket, hook)));
    }

    // on get room
    if (hasAccess('get_room', socket.user, options.rules)) {
      const hook = makeHook('get_room');
      socket.on('get_room', logger('get_room', getRoom(socket, hook)));
    }

    // on get rooms
    if (hasAccess('get_rooms', socket.user, options.rules)) {
      const hook = makeHook('get_rooms');
      socket.on('get_rooms', logger('get_rooms', getRooms(socket, hook)));
    }

    // on get rooms
    if (hasAccess('set_active_room', socket.user, options.rules)) {
      const hook = makeHook('set_active_room');
      socket.on('set_active_room', logger('set_active_room', setActiveRoom(socket, hook)));
    }

    // on typing
    if (hasAccess('typing', socket.user, options.rules)) {
      const hook = makeHook('typing');
      socket.on('typing', logger('typing', sendTyping(socket)));
    }

    // on receive message
    if (hasAccess('add_message', socket.user, options.rules)) {
      const hook = makeHook('add_message');
      socket.on('add_message', logger('add_message', addMessage(socket, options, hook)));
    }

    // on set last read
    if (hasAccess('set_last_read', socket.user, options.rules)) {
      const hook = makeHook('set_last_read');
      socket.on('set_last_read', logger('set_last_read', setLastRead(socket)));
    }

    // user disconnects
    socket.on('disconnect', logger('disconnect', () => {
      makeHook('disconnect')({ user: formatUser(socket.user) });
      SocketManager.deleteSocket(socket);
      console.log('a user disconnected, removing it form clients list');
      socket.disconnect(true);
    }));
  });
};

export default createChatServer;
