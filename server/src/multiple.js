import express from 'express';
import { Server } from 'http';
import moment from 'moment';

import { createClusteredChatServer } from 'kitchat-server';

import {
  APP_PORT, MONGO_URI, JWT_SECRET, MAX_MESSAGE_SIZE, REDIS_HOST, REDIS_PORT,
} from './config';


// Server & socket.io setup
const app = express();

app.post('/webhooks', (req, res) => {
  res.send('ok');
  console.log('WEBHOOK REACHED');
});

const server = Server(app);

app.listen(APP_PORT, () => console.log('[INFO] Server is listening on port', APP_PORT));

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
  whitelist: false,
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
  create_if: (user, rooms) => { // function returns boolean
    if (user.role === 'admin') return false;
    return !rooms
      .filter(room => room.custom_flags.indexOf('assistance') !== -1)
      .length;
  },
  first_message: () => ({ // function (user) => { foo: 'bar' }
    message: 'Hello world',
  }),
};
const customRooms = [customRoom];

const customRoomsGetter = {
  admin: [() => ({ // array of functions user => ({ foo: 'bar' })
    custom_flags: ['assistance'],
  })],
};

createClusteredChatServer(server, {
  debug: true,
  mongo_uri: MONGO_URI,
  redis_host: REDIS_HOST,
  redis_port: REDIS_PORT,
  jwt_secret: JWT_SECRET,
  max_message_size: MAX_MESSAGE_SIZE,
  rules: customRules,
  webhooks: customWebhooks,
  custom_rooms: customRooms,
  custom_rooms_getters: customRoomsGetter,
});
