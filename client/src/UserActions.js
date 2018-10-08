import React, { Component } from 'react';
import io from 'socket.io-client';
import jwt from 'jsonwebtoken';

class UserActions extends Component {
  constructor(args) {
    super(args);
    this.state = {
      socketUrl: 'http://localhost:8080',
      connected: false,
      socketQuery: null,
      user_id: this.props.user_id || '',
      updateUserData: '{ "firstname": "Florent", "lastname": "Béjina" }',
      secret: 'shhhh',
      other_user_id: '',
      rooms: [],
      activeRoomId: null,
      message: '',
      isTyping: false,
      roomNbMessage: 10,
    };
  }

  componentDidMount() {
    this.useId();
  }

  changeState(key, value) {
    this.setState({ [key]: value })
  }

  useId() {
    this.setState({ socketQuery: '{ "access_token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5MCJ9.FYloG256SlumQkZmlDhMHtBjerraUHfUJJLCWOmj450" }' })
  }

  useKitChatId() {
    this.setState({ socketQuery: '{ "access_token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJraXRjaGF0X3VzZXJfaWQiOiIxMjM0NTY3ODkwIn0.PNLW7ht_xvTTmNKVo7lwVaEteKXSCSXQxHTpoG2_SVk" }' })
  }

  initiateSocket() {
    this.socket.on('connected', () => this.changeState('connected', true));
    this.socket.on('disconnect', () => this.changeState('connected', false));
    this.socket.on('created', data => console.log('CREATED', data))
    this.socket.on('user_updated', data => console.log('USER UPDATED', data));
    this.socket.on('room_created', () => this.socket.emit('get_rooms'));
    this.socket.on('set_active_room', () => {
      console.log('ON SET ACTIVE ROOM');
      this.socket.emit('get_room', { nb_messages: 10 });
    })
    this.socket.on('message_sent', () => {
      console.log('ON MESSAGE SENT');
      this.setState({ message : '' })
    });
    this.socket.on('reconnect', () => {
      console.log('ON RECONNECT');
      if (this.state.activeRoomId) {
        this.socket.emit('set_active_room', { room_id: this.state.activeRoomId })
      }
    })
    this.socket.on('typing', isTyping => {
      console.log('IS TYPING', isTyping);
      this.setState({ isTyping });
    })
    this.socket.on('get_rooms', rooms => {
      console.log('ON GET ROOMS', rooms);
      this.setState({ rooms });
    });
    this.socket.on('get_room', room => {
      console.log('ON GET ROOM', room);
      this.setState({ currentRoom: room })
    })
  }

  updateUser() {
    try {
      const userData = JSON.parse(this.state.updateUserData);
      this.socket.emit('update_user', userData)
    } catch(e) {
      alert('invalid json');
    }
  }

  createRoom() {
    this.socket.emit('create_room', {
      user_id: this.state.other_user_id,
    });
  }

  selectRoom(roomId) {
    const callback = () => this.socket.emit('set_active_room', { room_id: roomId });
    this.setState({ activeRoomId: roomId }, callback)
  }

  async connect() {
    const access_token = await jwt.sign({ user_id: this.state.user_id }, this.state.secret);
    this.socket = io(this.state.socketUrl, { query: { access_token } });
    this.initiateSocket();
    this.socket.emit('get_rooms');
  }
  
  disconnect() {
    this.socket.disconnect();
    this.setState({ connected: false });
  }

  onMessageUpade(message) {
    this.socket.emit('typing', { room_id: this.state.activeRoomId })
    this.setState({ message })
  }
  
  sendMessage() {
    this.socket.emit('add_message', { room_id: this.state.activeRoomId, message: this.state.message })
  }

  getCurrentRoom() {
    console.log('getCurrentRoom')
    this.socket.emit('get_room', { nb_messages: this.state.roomNbMessage });
  }

  incrRoomLimitMessage() {
    const callback = () => this.socket.emit('get_room', { nb_messages : this.state.roomNbMessage })
    this.setState({ roomNbMessage: this.state.roomNbMessage + 10 }, callback)
  }

  render() {
    return (
      <div>
        <div>
          <h2>Connexion</h2>
          Connexion URL : <br />
          <input 
            type="text" 
            value={this.state.socketUrl} 
            onChange={e => this.changeState('socketUrl', e.target.value)} 
          />
          <br/>
          User id : <br />
          <input 
            type="text"
            value={this.state.user_id}
            onChange={e => this.changeState('user_id', e.target.value)}
          />
          <br />
          {!this.state.connected && <button onClick={() => this.connect()}>Connection</button>}
          {this.state.connected && <button onClick={() => this.disconnect()}>Déconnection</button>}
        </div>
        <div>
          <h2>Update user values</h2>
          <textarea 
            style={{ width: 500, height: 50 }}
            value={this.state.updateUserData}
            onChange={e => this.changeState('updateUserData', e.target.value)}
          /><br />
          <button
            onClick={() => this.updateUser()}
          >
            Send update user
          </button>
        </div>
        <div>
          <h2>Create Room</h2>
          Insert user_id : <input
            type="text"
            value={this.state.other_user_id}
            onChange={e => this.changeState('other_user_id', e.target.value)}
          /> <button
            onClick={() => this.createRoom()}
          >
            Create room
          </button>
        </div>
        <div>
          <h2>Rooms List</h2>
          Select room :
          <ul>
            {this.state.rooms.map(room => (
              <li key={room.room_id}>
                <button onClick={() => this.selectRoom(room.room_id)}>{room.room_id}</button>
                <ul>
                  {room.users.map(u => <li key={u.user_id}>{u.user_id}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Room data <small>{this.state.activeRoomId}</small></h2>
          <div>
            {this.state.isTyping && <span>Typing...<br /></span>}
            <textarea 
              onChange={e => this.onMessageUpade(e.target.value)}
              value={this.state.message}
            /><br />
            <button onClick={() => this.sendMessage()}>Send Message</button>
          </div>
          <ul>
            {
              this.state.currentRoom 
              && this.state.currentRoom.messages
              && this.state.currentRoom.messages
                .map(msg => (
                  <li key={msg.message_id}>
                    {msg.message} - <i>{msg.user.firstname}</i>
                  </li>
                ))
            }
            {
              this.state.currentRoom 
              && !this.state.currentRoom.allMessagesLoaded
              && <button
                onClick={() => this.incrRoomLimitMessage()}
              >See more...</button> 
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default UserActions;
