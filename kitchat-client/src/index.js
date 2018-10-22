
import io from 'socket.io-client'; //eslint-disable-line


class KitChatClient {
  constructor({ 
    url, 
    access_token, 
    options = {}, 
    listenersActions = {},
  }) {
    this._set = this._set.bind(this);
    this._addListener = this._addListener.bind(this);
    this._initListener = this._initListener.bind(this);
    this._initiateAllListeners = this._initiateAllListeners.bind(this);
    this._emit = this._emit.bind(this);
    this._on = this._on.bind(this);

    this.on = this.on.bind(this);
    this.create = this.create.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);

    this.getRooms = this.getRooms.bind(this);
    this.getRoom = this.getRoom.bind(this);

    this
      ._set('_url', url)
      ._set('_access_token', access_token)
      ._set('_options', {
        ...KitChatClient.DEFAULT_OPIONS,
        ...options,
      })
      ._set('_listenersActions', {
        ...KitChatClient.DEFAULT_LISTENER_ACTIONS,
        ...listenersActions,
      });
  }

  // private methods
  _set(key, value) {
    this[key] = value;
    return this;
  }

  _addListener(name, action) {
    this._listenersActions[name] = KitChatClient.logger.on(name, action);
    return this;
  }

  _initListener(name) {
    console.log('initListener', name)
    this._on(name, this._listenersActions[name])
    return this;
  }

  _initiateAllListeners() {
    console.log('_initiateAllListeners', this._listenersActions)
    Object.keys(this._listenersActions).forEach(this._initListener);
    return this;
  }

  _emit(name, data) {
    console.log('[EMIT]', name, 'data:', data)
    this.socket.emit(name, data);
    return this;
  }

  _on(name, action) {
    this.socket.off(name);
    this.socket.on(name, action);
    return this;
  }
  // end private methods 

  // default listeners
  onConnect(action) {
    return this.on('connect', KitChatClient.logger.on('connect', action, this.socket));
  }
  onGetRooms(action) {
    return this.on('get_rooms', KitChatClient.logger.on('get_rooms', action, this.socket));
  }
  onGetRoom(action) {
    return this.on('get_room', KitChatClient.logger.on('get_room', action, this.socket));
  }
  onGetUser(action) {
    return this.on('get_user', KitChatClient.logger.on('get_user', action, this.socket));
  }
  onSetActiveRoom(action) {
    return this.on('set_active_room', KitChatClient.logger.on('set_active_room', action, this.socket));
  }
  onMessageReceived(action) {
    return this.on('message_received', KitChatClient.logger.on('message_received', action, this.socket));
  }
  onMessageSent(action) {
    return this.on('message_sent', KitChatClient.logger.on('message_sent', action, this.socket));
  }
  onSetLastRead(action) {
    return this.on('set_last_read', KitChatClient.logger.on('set_last_read', action, this.socket));
  }
  onTyping(action) {
    return this.on('typing', KitChatClient.logger.on('typing', action, this.socket));
  }
  onRoomCreated(action) {
    return this.on('room_created', KitChatClient.logger.on('room_created', action, this.socket));
  }
  onRefetchRooms(action) {
    return this.on('refetch_rooms', KitChatClient.logger.on('refetch_rooms', action, this.socket));
  }
  // end default listeners

  // default emiters
  createRoom(user_id) {
    return this._emit('create_room', { user_id });
  }
  getRooms() {
    return this._emit('get_rooms');
  }
  getRoom(data = {}) {
    return this._emit('get_room', { nb_messages: data.nb_messages || this._options.messageChunkSize });
  }
  getUser() {
    return this._emit('get_user');
  }
  setActiveRoom(room_id) {
    return this._emit('set_active_room', { room_id });
  }
  setLastRead(room_id) {
    return this._emit('set_last_read', { room_id });
  }
  sendMessage(message) {
    return this._emit('add_message', { message });
  }
  typing() {
    return this._emit('typing');
  }
  updateUser(data) {
    return this._emit('update_user', data);
  }
  // end default emiters

  on(name, action) {
    return this
      ._addListener(name, action)
      ._initListener(name);
  }

  create() {
    this.socket = io(this._url, { 
        query: { access_token: this._access_token },
        autoConnect: this._options.autoConnect,
    });
    this.on('is_alive', () => this.socket.emit('is_alive'))
    return this._initiateAllListeners();
  }

  connect() {
    this.socket.connect()
    return this;
  }

  disconnect() {
    this.socket.disconnect()
    return this;
  }
}

KitChatClient.logger = {
  on: (name, action, socket) => (...args) => {
    process.env.NODE_ENV !== 'production' && console.log('[ON]', name, 'data:', args[0], 'socket id:', socket && socket.id);
    typeof action === 'function' && action(...args);
  },
}

KitChatClient.DEFAULT_LISTENER_ACTIONS = {
  connect: KitChatClient.logger.on('connect'),
  disconnect: KitChatClient.logger.on('disconnect'),
  created: KitChatClient.logger.on('created'),
  get_user: KitChatClient.logger.on('get_user'),
  room_created: KitChatClient.logger.on('room_created'),
  set_active_room: KitChatClient.logger.on('set_active_room'),
  message_sent: KitChatClient.logger.on('message_sent'),
  set_last_read: KitChatClient.logger.on('set_last_read'),
  reconnect: KitChatClient.logger.on('reconnect'),
  typing: KitChatClient.logger.on('typing'),
  get_rooms: KitChatClient.logger.on('get_rooms'),
  get_room: KitChatClient.logger.on('get_room'),
  refetch_rooms: KitChatClient.logger.on('refetch_rooms'),
  is_alive: KitChatClient.logger.on('is_alive'),
};

KitChatClient.DEFAULT_OPIONS = {
  autoConnect: false,
  messageChunkSize: 10,
};

export const createClient = (args) => new KitChatClient(args);

export default KitChatClient;