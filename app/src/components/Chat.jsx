import React from 'react';
import jwt from 'jsonwebtoken';
import KitChatClient from 'kitchat-client';

import RoomsList from './Rooms';
import Room from './Room';

const DEFAULT_STATE = {
  user_id: 'azer1',
  role: 'user',
  newRoom: null,
  secret: 'shhhh',
  rooms: [],
  connected: false,
  user: {},
  room: null,
  isTyping: false,
};

export default class Chat extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      ...DEFAULT_STATE,
      url: 'http://localhost:8080',
    };

    this.connection = this.connection.bind(this);
    this.disconnection = this.disconnection.bind(this);
    this.saveRooms = this.saveRooms.bind(this);
    this.loadActiveRoom = this.loadActiveRoom.bind(this);
    this.selectRoom = this.selectRoom.bind(this);
    this.fetchMoreMessages = this.fetchMoreMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.typing = this.typing.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  componentDidMount() {
    // this.state.url && this.connection();
  }

  componentWillUnmount() {
    this.client.disconnect();
  }

  onRoomCreated(room) {
    this.selectRoom(room.room_id);
    const { rooms = [] } = this.state;
    if (rooms.map(r => r.room_id).indexOf(room.room_id) === -1) {
      this.setState({
        newRoom: room,
      });
    }
  }


  async connection() {
    const {
      url, user_id, secret, role,
    } = this.state;
    const access_token = await jwt.sign({ user_id, role }, secret);
    this.client = new KitChatClient({
      url,
      access_token,
    });

    this.client
      .create()
      .onConnect(() => this.setState({ connected: true }))
      .onGetRooms(this.saveRooms)
      .onGetUser(user => this.setState({ user }))
      .onSetActiveRoom(this.client.getRoom)
      .onGetRoom(this.loadActiveRoom)
      .onMessageReceived(() => this.fetchMoreMessages(1))
      .onTyping(isTyping => this.setState({ isTyping }))
      .onSetLastRead(this.client.getRooms)
      .onRoomCreated(room => this.onRoomCreated(room))
      .connect()
      .getUser()
      .getRooms();
  }

  disconnection() {
    this.client.disconnect();
    this.setState({
      ...DEFAULT_STATE,
    });
  }

  loadActiveRoom(room) {
    this.setState({ room });
  }

  saveRooms(rooms) {
    let newRoom = null;
    const { newRoom: newStateRoom } = this.state;
    if (newStateRoom) {
      if (rooms.map(r => r.room_id).indexOf(newStateRoom.room_id) === -1) {
        newRoom = newStateRoom;
      }
    }
    this.setState({
      newRoom,
      rooms,
    });
  }

  selectRoom(roomId) {
    return this.client
      .setLastRead(roomId)
      .setActiveRoom(roomId);
  }

  createRoom(user_id) {
    this.client.createRoom(user_id);
  }

  updateState(key, value) {
    this.setState({ [key]: value });
  }

  fetchMoreMessages(nb) {
    const { room } = this.state;
    const { _options } = this.client;
    this.client.getRoom({
      nb_messages: (room.messages || []).length + (nb || _options.messageChunkSize),
    });
  }

  sendMessage(message) {
    this.client.sendMessage(message);
  }

  typing() {
    this.client.typing();
  }

  render() {
    const {
      user_id,
      url,
      connected,
      rooms,
      user,
      newRoom,
      isTyping,
      room,
      role,
    } = this.state;
    return (
      <div>
        <div style={{
          display: 'flex',
        }}
        >
          <input
            type="text"
            value={role}
            placeholder="role"
            onChange={e => this.updateState('role', e.target.value)}
          />
          <input
            type="text"
            value={user_id}
            placeholder="user id"
            onChange={e => this.updateState('user_id', e.target.value)}
          />
          <input
            type="text"
            style={{
              flex: 1,
            }}
            value={url}
            onChange={e => this.updateState('url', e.target.value)}
          />
          {
            !connected && (
              <button
                type="button"
                onClick={this.connection}
              >
                Connexion
              </button>
            )
          }
          {
            connected && (
              <button
                type="button"
                onClick={this.disconnection}
              >
                Déconnexion
              </button>
            )
          }
        </div>
        {connected
          && (
          <div style={{ display: 'flex' }}>
            <div style={{ width: 200 }}>
              <RoomsList
                rooms={rooms}
                me={user}
                selectRoom={this.selectRoom}
                createRoom={this.createRoom}
                newRoom={newRoom}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Room
                room={room}
                me={user}
                fetchMore={this.fetchMoreMessages}
                sendMessage={this.sendMessage}
                isTyping={isTyping}
                typing={this.typing}
              />
            </div>
          </div>
          )}
      </div>
    );
  }
}
