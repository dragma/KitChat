import mongoose from 'mongoose';
import bluebird from 'bluebird';
import express from 'express';
import socketIo from 'socket.io';
import { Server } from 'http';

import { MONGO_URI, APP_PORT } from './config';
import auth from './socketActions/auth';
import SocketManager from './utils/SocketManager';

// mogoose setup
mongoose.Promise = bluebird;
mongoose.connect(MONGO_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
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

  // user disconnects
  socket.on('disconnect', () => {
    SocketManager.deleteSocket(socket);
    console.log('a user disconnected, removing it form clients list');
    socket.disconnect(true);
  });
});
