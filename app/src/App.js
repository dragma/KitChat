import React, { Component } from 'react';
import UserActions from './UserActions';

import './App.css';
import Chat from './components/Chat';

class App extends Component {
  render() {
    return (
      <div>
        <div>
          <Chat />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginLeft: 30,
          marginRight: 30,
        }}
        >
          <div>
            <h2>User 1</h2>
            <UserActions user_id="azer1" />
          </div>
          <div>
            <h2>User 2</h2>
            <UserActions user_id="azer2" />
          </div>

        </div>
      </div>
    );
  }
}

export default App;
