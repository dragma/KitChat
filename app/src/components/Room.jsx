import React from 'react';
import PropTypes from 'prop-types';

import Message from './Message';
import RoomInput from './RoomInput';

export default class Room extends React.PureComponent {
  render() {
    const {
      room, isTyping, typing, sendMessage, me, fetchMore,
    } = this.props;

    if (!room) {
      return null;
    }

    return (
      <div>
        {
          !room.all_messages_fetched
          && (
            <button
              style={{ width: '100%' }}
              onClick={fetchMore}
              type="button"
            >
              Fetch more
            </button>
          )
        }
        {
          room.messages.slice().reverse().map(message => (
            <Message
              key={message.message_id}
              message={message}
              me={me}
            />
          ))
        }
        {isTyping && <p>Typing...</p>}
        <RoomInput
          sendMessage={sendMessage}
          typing={typing}
        />
      </div>
    );
  }
}

Room.propTypes = {
  room: PropTypes.object, // eslint-disable-line
  isTyping: PropTypes.bool,
  typing: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  me: PropTypes.object, // eslint-disable-line
  fetchMore: PropTypes.func.isRequired,
};

Room.defaultProps = {
  room: {
    all_messages_fetched: true,
    users: [],
    messages: [],
  },
  isTyping: false,
};
