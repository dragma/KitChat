# kitchat-server

## Introduction

The idea of KitChat emerged when I wan searching for a free simple and powerfull chat client-server to integrate to my projects so I don't have to bother developping one.

I couldn't find anyting that fillfilled my need so I started the KitChat project.

### What does it propose ?

KitChat is a simple "all-in-one" chat server build with [socket.io](https://socket.io/), [mongodb](https://www.mongodb.com) and [JWT](https://jwt.io/). It also uses [redis](https://redis.io/) in case of clusters of several chat servers.

It is fully parametrable, here are some things that kitchat offers :

  - Custom rooms
  - Custom rooms getters
  - Security with paramatrable rules on each listeners
  - Webhooks on each listeners
  - Clustering

It is made to work with the official [client](../kitchat-client).

## Documentation

## Basics

Simple chat node with `http.Server` and `express` server :

```javascript
import express from 'express';
import { Server } from 'http';
import { createSingleChatServer } from 'kitchat-server';

const app = express();

app.listen(3000, () => console.log('[INFO] Server is listening on port', 3000));

const server = Server(app);

createSingleChatServer(server, {
  mongo_uri: 'mongodb://localhost/kitchat',
  jwt_secret: 'shhhh',
});

```

## Advanced

Simple chat node with `http.Server` and `express` server :

```javascript
import express from 'express';
import { Server } from 'http';
import moment from 'moment';

import { createSingleChatServer } from 'kitchat-server';

const APP_PORT = 3000;
const MONGO_URI = 'mongodb://localhost/kitchat';
const JWT_SECRET = 'shhhh';
const MAX_MESSAGE_SIZE = 3000;

// Server & socket.io setup
const app = express();

app.post('/webhooks', (req, res) => {
  res.send('ok');
  console.log('WEBHOOK REACHED');
});

app.listen(APP_PORT, () => console.log('[INFO] Server is listening on port', APP_PORT));

const server = Server(app);
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
    user: ['create_room'], // array of available listeners
  },
};


const customWebhooks = {
  default: {
    url: `http://localhost:${APP_PORT}`,
    route: '/webhooks',
  },
  // all listeners have custom webhooks
  connection: true, // when true, default configuraiton applies
  update_user: { // you can apply full configuration for one listener
    url: `http://anotherurl.io`,
    route: '/custom-sub-route',
  },
  add_message: { // and partial
    route: '/custom-sub-route',
  },
};

const customRoom = {
  // can be one of all available listeners
  create_on: 'connection', 
  // function (user, rooms) => boolean
  // create room if true
  create_if: (user, rooms) => { 
    if (user.role === 'admin') return false;
    return !rooms
      .filter(room => room.custom_flags.indexOf('assistance') !== -1)
      .length;
  },
  // function (user, rooms) => Object
  // data to be inserted on the custom room
  room_data: user => ({ 
    users: [user.kitchat_user_id],
    name: 'Assitance',
    custom_flags: ['assistance'],
    last_read_at: {
      [user.kitchat_user_id]: moment().add(1, 'm').toDate(),
    },
  }),
  // function (user) => Object
  // data to be insterter on the first message
  // do not fill if not required
  first_message: () => ({ 
    message: 'Hello world',
  }),
};
const customRooms = [customRoom];

const customRoomsGetter = {
  // array of functions user => ({ foo: 'bar' })
  admin: [() => ({ 
    custom_flags: ['assistance'],
  })],
};

createSingleChatServer(server, {
  mongo_uri: MONGO_URI,
  jwt_secret: JWT_SECRET,
  max_message_size: MAX_MESSAGE_SIZE,
  rules: customRules,
  webhooks: customWebhooks,
  custom_rooms: customRooms,
  custom_rooms_getters: customRoomsGetter,
});


```