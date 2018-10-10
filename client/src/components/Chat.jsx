import React from 'react';
import jwt from 'jsonwebtoken';

import KitChatClient from '../KitChat-client';
import RoomsList from './Rooms';
import Room from './Room';

const DEFAULT_STATE = {
  user_id: 'azer1',
  newRoom: null,
  secret: 'shhhh',
  rooms: [],
  connected: false,
  user: {},
  room: null,
  isTyping: false,
}

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

  saveRooms(rooms) {
    let newRoom = null;
    console.log('saveRooms', rooms)
    if (this.state.newRoom) {
      if (rooms.map(r => r.room_id).indexOf(this.state.newRoom.room_id) === -1) {
        newRoom = this.state.newRoom;
      }
    }
    this.setState({ 
      newRoom,
      rooms,
    })
  }

  loadActiveRoom(room) {
    this.setState({ room })
  }
  
  async connection() {
    const access_token = await jwt.sign({ user_id: this.state.user_id }, this.state.secret);
    this.client = new KitChatClient({
      url: this.state.url,
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
      .onRoomCreated((room) => this.onRoomCreated(room))
      .connect()
      .getUser()
      .getRooms();
  }

  disconnection() {
    this.client.disconnect();
    this.setState({ 
      ...DEFAULT_STATE,  
    })
  }

  onRoomCreated(room) {
    this.selectRoom(room.room_id);
    if (this.state.rooms.map(r => r.room_id).indexOf(room.room_id) === -1) {
      this.setState({
        newRoom: room,
      });
    }
    
  }

  selectRoom(roomId) {
    this.setState(
      { activeRoomId: roomId }, 
      () => this.client
        .setLastRead(roomId)
        .setActiveRoom(this.state.activeRoomId)
      );
  }

  createRoom(user_id) {
    this.client.createRoom(user_id);
  }

  updateState(key, value) {
    this.setState({ [key]: value });
  }

  fetchMoreMessages(nb) {
    this.client.getRoom({
      nb_messages: this.state.room.messages.length + (nb || this.client._options.messageChunkSize),
    });
  }

  sendMessage(message) {
    this.client.sendMessage(message)
  }

  typing() {
    this.client.typing();
  }

  render() {
    return(
      <div>
        <div style={{
          display: 'flex',
        }}>
        <input 
          type="text" 
          value={this.state.user_id} 
          onChange={e => this.updateState('user_id', e.target.value)} 
        />
        <input 
          type="text" 
          style={{
            flex: 1,
          }}
          value={this.state.url} 
          onChange={e => this.updateState('url', e.target.value)} 
        />
          {
            !this.state.connected && (
              <button
                onClick={this.connection}
              >
                Connexion
              </button>
            )
          }
          {
            this.state.connected && (
              <button
                onClick={this.disconnection}
              >
                Déconnexion
              </button>
            )
          }
        </div>
        {this.state.connected && 
          <div style={{ display: 'flex' }}>
            <div style={{ width: 200 }}>
              <RoomsList 
                rooms={this.state.rooms} 
                me={this.state.user} 
                selectRoom={this.selectRoom}
                createRoom={this.createRoom}
                newRoom={this.state.newRoom}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Room 
                room={this.state.room} 
                me={this.state.user} 
                fetchMore={this.fetchMoreMessages}
                sendMessage={this.sendMessage}
                isTyping={this.state.isTyping}
                typing={this.typing}
              />
            </div>
          </div>}  
      </div>
    )
  }
}