import React from 'react';

export default class RoomItem extends React.PureComponent {
  getRoomName() {
    return this.props.room.users
      .filter(u => u.user_id !== this.props.me.user_id)
      .map(u => `${u.firstname} ${u.lastname}`)
      .join(',');
  }
  
  render() {
    return (
      <li 
      key={this.props.room.room_id}
      style={{
        listStyleType: 'none',
        margin: 0,
        padding: 10,
        cursor: 'pointer',
        fontWeight: (this.props.room.read && 'initial') || 'bold'
      }}
      onClick={() => this.props.selectRoom(this.props.room.room_id)}
    >
      {this.getRoomName()}
    </li>
    )
  }
}

RoomItem.defaultProps = {
  rooms: {
    users: [],
  },
  me: {},
  selectRoom: () => {},
};