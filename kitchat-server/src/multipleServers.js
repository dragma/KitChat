import mongoose from 'mongoose';
import bluebird from 'bluebird';
import socketIo from 'socket.io';
import redisAdapter from 'socket.io-redis';

import {
  MAX_MESSAGE_SIZE, MONGO_URI, JWT_SECRET, REDIS_HOST, REDIS_PORT,
} from './config';

import auth from './socketActions/auth';
import onConnection from './socketActions/onConnection';

import eventLogger from './utils/eventLogger';
import CustomRoomManager from './utils/CustomRoomManager';
import CustomRoomsGetterManager from './utils/CustomRoomsGettersManager';
import webhook from './utils/webhook';

// default options
const defaultOptions = {
  max_message_size: MAX_MESSAGE_SIZE,
  mongo_uri: MONGO_URI,
  jwt_secret: JWT_SECRET,
  rules: {},
  webhooks: {},
  cutom_rooms: [],
  custom_rooms_getters: {},
  redis_host: REDIS_HOST,
  redis_port: REDIS_PORT,
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
const createClusteredChatServer = (server, userOptions) => {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  connectMongo(options.mongo_uri);

  const makeHook = webhook(options.webhooks, options.jwt_secret);

  options
    .cutom_rooms
    .forEach(customRoom => CustomRoomManager.addCustomRoom(customRoom));

  const io = socketIo(server);

  io.adapter(redisAdapter({ host: options.redis_host, port: options.redis_port }));

  CustomRoomsGetterManager.io = io;

  Object.keys(options.custom_rooms_getters)
    .forEach(key => CustomRoomsGetterManager.add(key, options.custom_rooms_getters[key]));

  io.use(auth(options.jwt_secret));

  const params = {
    io,
    options,
    makeHook,
    logger: eventLogger,
  };

  io.on('connection', socket => onConnection(socket, params));
};

export default createClusteredChatServer;
