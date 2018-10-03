import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';

class App extends Component {
  constructor(args) {
    super(args);
    this.state = {
      socketUrl: 'http://localhost:8080',
      connected: false,
      socketQuery: null,
      updateUserData: '{ "firstname": "Florent", "lastname": "Béjina" }'
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
    this.socket.on('user_updated', data => console.log('USER UPDATED', data))
  }

  updateUser() {
    let userData = null;
    try {
      userData = JSON.parse(this.state.updateUserData);
    } catch(e) {
      alert('invalid json');
    }
    this.socket.emit('update_user', userData)
  }

  connect() {
    let socketQuery = null;
    try {
      socketQuery = JSON.parse(this.state.socketQuery);
    } catch(e) {
      alert('invalid json');
    }
    this.socket = io(this.state.socketUrl, { query: socketQuery });
    this.initiateSocket();
  }
  

  disconnect() {
    this.socket.disconnect();
    this.setState({ connected: false });
  }
  
  render() {
    return (
      <div>
        <p>
          <h2>Connexion</h2>
          Connexion URL : <br />
          <input 
            type="text" 
            value={this.state.socketUrl} 
            onChange={e => this.changeState('socketUrl', e.target.value)} 
          />
          <br/>
          Socket query : <br/>
          <button onClick={() => this.useId()}>Use internal ID</button>
          <button onClick={() => this.useKitChatId()}>Use kitchat ID</button><br />
          <textarea 
            style={{ width: 500, height: 150 }}
            value={this.state.socketQuery}
            onChange={e => this.changeState('socketQuery', e.target.value)}
          /><br />
          {!this.state.connected && <button onClick={() => this.connect()}>Connection</button>}
          {this.state.connected && <button onClick={() => this.disconnect()}>Déconnection</button>}
        </p>
        <p>
          <h2>Update values</h2>
          <textarea 
            style={{ width: 500, height: 150 }}
            value={this.state.updateUserData}
            onChange={e => this.changeState('updateUserData', e.target.value)}
          /><br />
          <button
            onClick={() => this.updateUser()}
          >
            Send update user
          </button>
        </p>
      </div>
    );
  }
}

export default App;
