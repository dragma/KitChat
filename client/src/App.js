import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';

class App extends Component {
  constructor(args) {
    super(args);
    this.state = {
      socketUrl: 'http://localhost:8080',
      connected: false,
      socketQuery: '{ "access_token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5MCJ9.FYloG256SlumQkZmlDhMHtBjerraUHfUJJLCWOmj450" }',
    };
  }

  changeState(key, value) {
    this.setState({ [key]: value })
  }

  initiateSocket() {
    this.socket.on('connected', () => this.changeState('connected', true));
    this.socket.on('disconnect', () => this.changeState('connected', false));
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
          Connexion URL : <br />
          <input 
            type="text" 
            value={this.state.socketUrl} 
            onChange={e => this.changeState('socketUrl', e.target.value)} 
          />
          <br/>
          Socket query : <br/>
          <textarea 
            value={this.state.socketQuery}
            onChange={e => this.changeState('socketQuery', e.target.value)}
          /><br />
          {!this.state.connected && <button onClick={() => this.connect()}>Connection</button>}
          {this.state.connected && <button onClick={() => this.disconnect()}>Déconnection</button>}
        </p>
      </div>
    );
  }
}

export default App;
