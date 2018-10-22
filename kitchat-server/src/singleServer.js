import mongoose from 'mongoose';
import bluebird from 'bluebird';
import socketIo from 'socket.io';

import { MAX_MESSAGE_SIZE, MONGO_URI, JWT_SECRET } from './config';

import auth from './socketActions/auth';
import onConnection from './socketActions/onConnection';

import CustomRoomManager from './utils/CustomRoomManager';
import CustomRoomsGetterManager from './utils/CustomRoomsGettersManager';
import eventLogger from './utils/eventLogger';
import webhook from './utils/webhook';
import connectMongo from './utils/connectMongo';

// default options
const defaultOptions = {
  max_message_size: MAX_MESSAGE_SIZE,
  mongo_uri: MONGO_URI,
  jwt_secret: JWT_SECRET,
  rules: {},
  webhooks: {},
  custom_rooms: [],
  custom_rooms_getters: {},
};

// mogoose setup
mongoose.Promise = bluebird;

// Server & socket.io setup
const createSingleChatServer = (server, userOptions) => {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  connectMongo(options.mongo_uri);

  const makeHook = webhook(options.webhooks, options.jwt_secret);

  options
    .custom_rooms
    .forEach(customRoom => CustomRoomManager.addCustomRoom(customRoom));

  const io = socketIo(server);

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

export default createSingleChatServer;
