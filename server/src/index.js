import express from 'express';
import { Server } from 'http';

import mountChatServer from 'kitchat-server';

import {
  APP_PORT, MONGO_URI, JWT_SECRET, MAX_MESSAGE_SIZE,
} from './config';


// Server & socket.io setup
const app = express();
const server = Server(app);

server.listen(APP_PORT, () => console.log('[INFO] Server is listening on port', APP_PORT));

/*
  available listeners :
    'get_user'
    'update_user'
    'create_room'
    'get_room'
    'get_rooms'
    'set_active_room'
    'typing'
    'add_message'
    'set_last_read'
*/
const customRules = {
  rulesType: 'blacklist', // or whitelist
  rules: {
    user: ['create_room'],
  },
};

mountChatServer(server, {
  mongo_uri: MONGO_URI,
  jwt_secret: JWT_SECRET,
  max_message_size: MAX_MESSAGE_SIZE,
  rules: customRules,
});
