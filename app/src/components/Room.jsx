import React from 'react';

import Message from './Message';
import RoomInput from './RoomInput';

export default class Room extends React.PureComponent {
  render() {
    if (!this.props.room) {
      return null;
    }

    return (
      <div>
        {
          !this.props.room.all_messages_fetched 
          && <button style={{ width: '100%' }} onClick={this.props.fetchMore}>Fetch more</button>
        }
        {
          this.props.room.messages.slice().reverse().map(message => <Message 
            key={message.message_id} 
            message={message} 
            me={this.props.me}
          />)
        }
        {this.props.isTyping && <p>Typing...</p>}
        <RoomInput 
          sendMessage={this.props.sendMessage}
          typing={this.props.typing}
        />
      </div>
    )
  }
}

Room.defaultProps = {
  room: {
    all_messages_fetched: true,
    users: [],
    messages: [],
  },
};