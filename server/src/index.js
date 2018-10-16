import express from 'express';
import { Server } from 'http';
import moment from 'moment';

import mountChatServer from 'kitchat-server';

import {
  APP_PORT, MONGO_URI, JWT_SECRET, MAX_MESSAGE_SIZE,
} from './config';


// Server & socket.io setup
const app = express();

app.post('/webhooks', (req, res) => {
  res.send('ok');
  console.log('WEBHOOK REACHED');
});

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
  rules_type: 'blacklist', // or whitelist
  rules: {
    user: ['create_room'],
  },
};
const customWebhooks = {
  default: {
    url: `http://localhost:${APP_PORT}`,
    route: '/webhooks',
  },
  // all listeners have custom webhooks
  connection: true,
  disconnect: true,
  get_user: true,
  update_user: true,
  create_room: true,
  get_room: true,
  get_rooms: true,
  set_active_room: true,
  typing: true,
  set_last_read: true,
  add_message: {
    url: `http://localhost:${APP_PORT}`,
    route: '/webhooks',
  },
};

const customRoom = {
  create_on: 'connection', // can be on of all listeners
  room_data: user => ({ // function (user, rooms) => { foo: 'bar' }
    users: [user.kitchat_user_id],
    name: 'Assitance',
    custom_flags: ['assistance'],
    last_read_at: {
      [user.kitchat_user_id]: moment().add(1, 'm').toDate(),
    },
  }),
  create_if: (user, rooms) => !rooms
    .filter(room => room.custom_flags.indexOf('assistance') !== -1)
    .length, // function returns boolean
  first_message: () => ({ // function (user) => { foo: 'bar' }
    message: 'Hello world',
  }),
};
const customRooms = [customRoom];

mountChatServer(server, {
  mongo_uri: MONGO_URI,
  jwt_secret: JWT_SECRET,
  max_message_size: MAX_MESSAGE_SIZE,
  rules: customRules,
  webhooks: customWebhooks,
  cutom_rooms: customRooms,
});
