<center>
  <img src="../logo.png" />
  <h1>KitChat server</h1>
</center>


[![npm version](https://badge.fury.io/js/kitchat-server.svg)](https://badge.fury.io/js/kitchat-server)

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
  whitelist: false, // or whitelist
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
## Available listeners

|name|description|
|---|---|
|`connection`|When a connection is made between the client and the server|
|`get_user`|When user data is requested|
|`update_user`|When user data is updated|
|`create_room`|When room is requested to be created|
|`get_room`|When room content is requested|
|`get_rooms`|When rooms list is requested|
|`set_active_room`|When room is requested to be the active one|
|`typing`|When a user is typing|
|`add_message`|When a message is requested to be added to the room|
|`set_last_read`|When the current room is requested to be marked as read|
 
## `createSingleChatServer` and `createClusteredChatServer` parameters

Each of there two function takes an object in parameters

|key|description|type|default|required|
|---|---|---|---|---|
|`jwt_secret`|String passed to jwt to decode the client's `access-token`| `String`|`shhhh`|**yes**|
|`mongo_uri`|The connection url for your mongodb database|`String`|`mongodb://localhost/kitchat`|**yes**|
|`max_message_size`|Maximum message characters|`Number`|`3000` |*no*|
|`rules`|See custom rules description [below](#custom-rules).|`Object`|`{}`|*no*|
|`webhooks`|See webhooks description [below](#webhooks)|`Object`|`{}`|*no*|

### Custom rules

|key|description|required|default|
|---|---|---|---|
|`whitelist`|Whitelist rules instead of blacklisting them.|*no*|`false`|
|`rules`|`{ role: ['array', 'of', 'available', 'listeners'] }`|**yes**|`null`|

#### Example
```javascript
const rules = {
  whitelist: false,
  rules: {
    user: ['create_room'],
    guest: ['create_room', 'get_rooms', 'add_message', 'update_user', 'typing']
  },
};
```

This sample means that :

- The socket identified as a `user` won't have the permission to use the `create-room` event (and won't be able to create a room). 
- The socket identified as `guest` will not be able to create a room, list all rooms, add a message to a room, update its user values.

### Webhooks

When a event is triggered, a call to a special location can be made with some detailed informations.

You can trigger webhooks on all [available listeners](#available-listeners). 

|key|value|required|
|---|---|---|
|`default`|[configuration object](#webhook-configuration)|*no*|
|any [available listeners](#available-listeners)|`true` or [configuration object](#webhook-configuration)|*no*|

When the value is set tu `true`, the default object will be used.
 
#### Webhook configuration

 |key|description|
 |---|---|
 |`url`|destination base url|
 |`route`|suffixes the url|

> You can only fill one of the two fields. In case of a missing field, default will be used.

#### Example 

```javascript
const customWebhooks = {
  default: {
    url: `http://mywebsite.com`,
    route: '/webhooks',
  },
  connection: true,
  add_message: {
    route: '/webhooks/add-message',
  },
  create_room: {
    url: `http://alternativewebsite.com`,
    route: '/on-room-created',
  },
  update_user: {
    url: `http://alternativewebsite.com`,
  },
};
 ```

 In this case :

 - On `connection`, the server will hit `http://mywebsite.com/webhooks`
 - On `add_message`, the server will hit `http://mywebsite.com/webhooks/add-message`
 - On `create_room`, the server will hit `http://alternativewebsite.com/on-room-created`
 - On `update_user`, the server will hit `http://alternativewebsite.com/webhooks`


### Custom rooms

With kitchat you can create custom rooms.
A custom room is defined like this :

|key|type|description|required|
|---|---|---|---|
|create_on|`string`|any [available listener](#available-listeners)|**true**|
|create_if|`function`|A function that takes the [user](#user-definition) and his [room](#room-definition)s as parameters. Must return a boolean. `(user, rooms) => true;`|**true**|
|room_data|`function`|A function that takes the [user](#user-definition) and his [room](#room-definition)s as parameters. Must return a [room](#room-definition) object. `(user, rooms) => ({})`|**true**|
|first_message|`function`|A function that takes the [user](#user-definition) as parameter. Must return a [message](#message-definition) object. `user => ({})`|


#### Custom room getters

You can add custom rules, based on the user scope. Each getter is a function that takes a [user](#user-definition) as parameter, and returns a [room](#room-definition) like object. This returned value will be used to search rooms that'll match the definition.

Example:
```javascript
const customRoomsGetter = {
  admin: [() => ({ // array of functions user => ({ foo: 'bar' })
    custom_flags: ['assistance'],
  })],
};
```

#### Example 

Let's use an example to illustrate these features.

I want, for each user, a special room used for assitance, only visible by an admin. This room

```javascript
const customRoom = {
  create_on: 'connection', // can be on of all listeners
  room_data: user => ({ // function (user, rooms) => ({ foo: 'bar' })
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
  first_message: () => ({ // function (user) => ({ foo: 'bar' })
    message: 'Hello world',
  }),
};
const customRooms = [customRoom];

const customRoomsGetter = {
  admin: [() => ({ // array of functions user => ({ foo: 'bar' })
    custom_flags: ['assistance'],
  })],
};
```

## Schemas definitions

### User definition

|key|type|description|default value|
|---|---|---|---|
|_id`*`|`ObjectId`|mongodb ObjectId|*--*|
|created_at|`Date`||*Date.now*|
|secondary_id|`String`|insert here your system's user id|*null*|
|firstname|`String`|firstname|*null*|
|lastname|`String`|lastname|*null*|
|nickname|`String`|nickname|*null*|

> `*` _id is exposed as `kitchat_user_id`

### Room definition

|key|type|description|default value|
|---|---|---|---|
|_id`*`|`ObjectId`|mongodb ObjectId|*--*|
|created_at|`Date`||*Date.now*|
|users|`[ObjectId]`|Array of User._id|*--*|
|custom_flags|`[string]`|Mostly used with custom rooms|*null*|
|last_read_at|`Object`| Composed with a user id as key, and a date as its value. Ex: `{[userId]: Date}`.|*null*|
|name|`String`|If not set, room name is build with users name|*null*|

> `*` _id is exposed as `room_id`

### Message definition

|key|type|description|default value|
|---|---|---|---|
|_id`*`|`ObjectId`|mongodb ObjectId|*--*|
|created_at|`Date`||*Date.now*|
|user|`ObjectId`|User._id|*--*|
|rooms|`ObjectId`|Room._id|*--*|
|message|`String`|message|*null*|

> `*` _id is exposed as `room_id`