import mongoose from 'mongoose';
import bluebird from 'bluebird';
import express from 'express';
import socketIo from 'socket.io';
import { Server } from 'http';

import { MONGO_URI, APP_PORT } from './config';
import auth from './socketActions/auth';
import updateUser from './socketActions/updateUser';
import createRoom from './socketActions/createRoom';
import getRooms from './socketActions/getRooms';
import getRoom from './socketActions/getRoom';
import setActiveRoom from './socketActions/setActiveRoom';

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

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  SocketManager.addSocket(socket);

  // send connected event
  socket.emit('connected');

  // on user update
  socket.on('update_user', updateUser(socket));

  // on create room
  socket.on('create_room', createRoom(socket));

  // on get room
  socket.on('get_room', getRoom(socket));

  // on get rooms
  socket.on('get_rooms', getRooms(socket));

  // on get rooms
  socket.on('set_active_room', setActiveRoom(socket));

  // user disconnects
  socket.on('disconnect', () => {
    SocketManager.deleteSocket(socket);
    console.log('a user disconnected, removing it form clients list');
    socket.disconnect(true);
  });
});
