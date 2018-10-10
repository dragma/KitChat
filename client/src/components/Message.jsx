import React from 'react';
import moment from 'moment';

export default class Message extends React.PureComponent {
  getUserName() {
    const { user } = this.props.message;
    return `${user.firstname} ${user.lastname}`;
  }
  getDate() {
    return moment(this.props.message.created_at).format(' DD MMM à HH:mm')
  }
  render() {
    return (
      <p><i>{this.getUserName()}</i> <small>({this.getDate()})</small> - {this.props.message.message}</p>
    )
  }
}

Message.defaultProps = {
  message: {
    user: {},
  },
};