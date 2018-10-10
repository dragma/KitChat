import React from 'react';
import moment from 'moment';

import RoomItem from './RoomItem';

export default class RoomsList extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      user_id: '',
    };
  }
  createRoom() {
    this.props.createRoom(this.state.user_id);
    this.setState({ user_id : ''})
  }
  render() {
    return (
      <ul style={{
        margin: 0,
        padding: 0,
      }}>
        {this.props.newRoom && 
        <RoomItem
          room={this.props.newRoom}
          me={this.props.me}
          selectRoom={this.props.selectRoom}
        />}
        {this.props.rooms
          .sort((r1, r2) => {
            return +moment(r2.messages[0].created_at) - +moment(r1.messages[0].created_at)
          })
          .map(room => <RoomItem 
          key={room.room_id} 
          room={room} 
          me={this.props.me}
          selectRoom={this.props.selectRoom}
        />)}
        <div>
          New chat with (user_id)
          <input 
            style={{ width: '100%' }}
            value={this.state.userId}
            onChange={e => this.setState({ user_id: e.target.value })}
          />
          <button style={{ width: '100%' }} onClick={() => this.createRoom()}>Create</button>
        </div>
      </ul>
    )
  }
}

RoomsList.defaultProps = {
  rooms: [],
};