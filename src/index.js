import mongoose from 'mongoose';
import bluebird from 'bluebird';
import express from 'express';
import socketIo from 'socket.io';
import { Server } from 'http';

import { MONGO_URI, APP_PORT } from './config';
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

import SocketManager from './utils/SocketManager';

// mogoose setup
mongoose.Promise = bluebird;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('[INFO] Connected to Mongo'));


// Server & socket.io setup
const app = express();
const server = Server(app);

server.listen(APP_PORT, () => console.log('[INFO] Server is listening on port', APP_PORT));

const io = socketIo(server);

io.use(auth);

const logger = (name, action) => (data) => {
  console.log('[EVENT] on', name);
  return action(data);
};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  SocketManager.addSocket(socket);

  // on get user
  socket.on('get_user', logger('get_user', getUser(socket)));

  // on user update
  socket.on('update_user', logger('update_user', updateUser(socket)));

  // on create room
  socket.on('create_room', logger('create_room', createRoom(socket)));

  // on get room
  socket.on('get_room', logger('get_room', getRoom(socket)));

  // on get rooms
  socket.on('get_rooms', logger('get_rooms', getRooms(socket)));

  // on get rooms
  socket.on('set_active_room', logger('set_active_room', setActiveRoom(socket)));

  // on typing
  socket.on('typing', logger('typing', sendTyping(socket)));

  // on receive message
  socket.on('add_message', logger('add_message', addMessage(socket)));

  // on set last read
  socket.on('set_last_read', logger('set_last_read', setLastRead(socket)));

  // user disconnects
  socket.on('disconnect', logger('disconnect', () => {
    SocketManager.deleteSocket(socket);
    console.log('a user disconnected, removing it form clients list');
    socket.disconnect(true);
  }));
});
