import React, { Component } from 'react';
import UserActions from './UserActions';

import './App.css';

class App extends Component {
 
  render() {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginLeft: 30, 
        marginRight: 30,
      }}>
        <div>
          <h2>User 1</h2>
          <UserActions user_id="azer1"/>
        </div>
        <div>
          <h2>User 2</h2>
          <UserActions user_id="azer2"/>
        </div>
          
      </div>
    );
  }
}

export default App;
