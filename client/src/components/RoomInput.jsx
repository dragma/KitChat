import React from 'react';

import Message from './Message';

export default class Room extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      message: '',
    }
    this.send = this.send.bind(this);
  }

  typing(message) {
    this.props.typing();
    this.setState({ message })
  }

  send() {
    this.props.sendMessage(this.state.message);
    this.setState({ message: '' });
  }

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <input 
          type="text" 
          style={{ flex: 1 }}
          value={this.state.message}
          onChange={e => this.typing(e.target.value )}
        />
        <button onClick={this.send}>Envoyer</button>
      </div>
    );
  }
}

Room.defaultProps = {
  room: {
    all_messages_fetched: true,
    users: [],
    messages: [],
  },
};